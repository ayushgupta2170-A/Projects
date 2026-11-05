
const socket=io();

let map;
let myMarker=null;
let nearbyMarkers=[];
let otherMarkers={};
let infoWindow;
let lastSearchTime=0;
let lastSearchLocation=null;
let searching=false;

window.initMap=async function(){
    try{
        const {Map,InfoWindow}=await google.maps.importLibrary("maps");
        const {Place,SearchNearbyRankPreference}=await google.maps.importLibrary("places");

        map=new Map(document.getElementById("map"),{
            center:{lat:27.384914,lng:80.114781},
            zoom:16,
            mapTypeControl:true,
            streetViewControl:true,
            fullscreenControl:true
        });

        infoWindow=new InfoWindow();

        if(!navigator.geolocation){
            alert("Your browser does not support location.");
            return;
        }

        navigator.geolocation.watchPosition(
            async(position)=>{
                const lat=position.coords.latitude;
                const lng=position.coords.longitude;

                const currentPosition={lat,lng};

                socket.emit("send-location",{
                    latitude:lat,
                    longitude:lng
                });

                if(!myMarker){
                    myMarker=new google.maps.Marker({
                        position:currentPosition,
                        map:map,
                        title:"Your Live Location",
                        icon:{
                            path:google.maps.SymbolPath.CIRCLE,
                            scale:9,
                            fillColor:"#4285F4",
                            fillOpacity:1,
                            strokeColor:"#ffffff",
                            strokeWeight:3
                        }
                    });
                }else{
                    myMarker.setPosition(currentPosition);
                }

                map.panTo(currentPosition);

                const now=Date.now();

                let moved=true;

                if(lastSearchLocation){
                    const distance=google.maps.geometry?
                        google.maps.geometry.spherical.computeDistanceBetween(
                            new google.maps.LatLng(lat,lng),
                            new google.maps.LatLng(
                                lastSearchLocation.lat,
                                lastSearchLocation.lng
                            )
                        ):200;
                    moved=distance>100;
                }

                if((now-lastSearchTime>60000||!lastSearchLocation)&&moved&&!searching){
                    lastSearchTime=now;
                    lastSearchLocation=currentPosition;
                    searchNearby(lat,lng,Place,SearchNearbyRankPreference);
                }
            },
            (error)=>{
                console.error("Location Error:",error.message);
                alert("Location error: "+error.message);
            },
            {
                enableHighAccuracy:true,
                timeout:20000,
                maximumAge:0
            }
        );

        async function searchNearby(lat,lng,Place,RankPreference){
            if(searching)return;
            searching=true;

            try{
                const {places}=await Place.searchNearby({
                    fields:[
                        "displayName",
                        "location",
                        "formattedAddress",
                        "primaryType"
                    ],
                    locationRestriction:{
                        center:{lat,lng},
                        radius:1500
                    },
                    includedTypes:[
                        "place_of_worship",
                        "restaurant",
                        "hospital",
                        "school",
                        "atm",
                        "bank",
                        "store",
                        "pharmacy"
                    ],
                    maxResultCount:20,
                    rankPreference:RankPreference.DISTANCE
                });

                nearbyMarkers.forEach(marker=>marker.setMap(null));
                nearbyMarkers=[];

                places.forEach(place=>{
                    if(!place.location)return;

                    const marker=new google.maps.Marker({
                        map:map,
                        position:place.location,
                        title:place.displayName||"Nearby Place"
                    });

                    marker.addListener("click",()=>{
                        infoWindow.setContent(
                            `<b>${place.displayName||"Place"}</b><br>${place.formattedAddress||""}`
                        );
                        infoWindow.open(map,marker);
                    });

                    nearbyMarkers.push(marker);
                });

                console.log("Nearby places:",places.length);
            }catch(error){
                console.error("Nearby Places Error:",error);
            }finally{
                searching=false;
            }
        }

        socket.on("receive-location",(data)=>{
            const{id,latitude,longitude}=data;

            if(id===socket.id)return;

            const position={lat:latitude,lng:longitude};

            if(otherMarkers[id]){
                otherMarkers[id].setPosition(position);
            }else{
                otherMarkers[id]=new google.maps.Marker({
                    map:map,
                    position:position,
                    title:"Other User"
                });
            }
        });

        socket.on("user-disconnected",(id)=>{
            if(otherMarkers[id]){
                otherMarkers[id].setMap(null);
                delete otherMarkers[id];
            }
        });

    }catch(error){
        console.error("Google Maps Error:",error);
    }
};
