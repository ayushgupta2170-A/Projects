const validateRegistration=(data)=>{
    const errors={};

    if(!data||typeof data!=="object"||Array.isArray(data)){
        return {valid:false,errors:{form:"Invalid form data"}};
    }

    const name=typeof data.name==="string"?data.name.trim():"";
    const email=typeof data.email==="string"?data.email.trim().toLowerCase():"";
    const phone=typeof data.phone==="string"?data.phone.trim():"";
    const studentNumber=typeof data.studentNumber==="string"?data.studentNumber.trim():"";
    const universityRollNumber=typeof data.universityRollNumber==="string"?data.universityRollNumber.trim():"";
    const year=data.year;
    const branch=data.branch;
    const domainOfInterest=typeof data.domainOfInterest==="string"?data.domainOfInterest.trim():"";
    const collegeOrganization=typeof data.collegeOrganization==="string"?data.collegeOrganization.trim():"";

    // Name
    if(name.length<2){
        errors.name="Name must contain at least 2 characters";
    }else if(!/^[\p{L}][\p{L}\s'-]*$/u.test(name)){
        errors.name="Enter a valid name";
    }

    // Email
    if(!email){
        errors.email="Email is required";
    }else if(!/^[^\s@]+@(gmail\.com|akgec\.ac\.in)$/i.test(email)){
        errors.email="Only Gmail and AKGEC email allowed";
    }

    // Phone
    if(!/^(?:\+91)?[6-9][0-9]{9}$/.test(phone)){
        errors.phone="Enter a valid Indian mobile number";
    }

    // Student number
    if(!/^[0-9]{7}$/.test(studentNumber)){
        errors.studentNumber="Student number must be exactly 7 digits";
    }

    // University roll number
    if(!/^[0-9]{13}$/.test(universityRollNumber)){
        errors.universityRollNumber="Roll number must be exactly 13 digits";
    }

    // Year
    if(!["2nd Year","3rd Year","4th Year"].includes(year)){
        errors.year="Select a valid year";
    }

    // Branch
    const branches=["CS","CSE","CSE-AIML","CSIT","IT","CSE-DS","AIML","Civil","Mechanical","ECE","CSE Hindi"];

    if(!branches.includes(branch)){
        errors.branch="Select a valid branch";
    }

    // Optional fields
    if(typeof data.domainOfInterest!=="undefined"&&typeof data.domainOfInterest!=="string"){
        errors.domainOfInterest="Invalid domain";
    }

    if(typeof data.collegeOrganization!=="undefined"&&typeof data.collegeOrganization!=="string"){
        errors.collegeOrganization="Invalid college name";
    }

    // Consent
    if(data.consent!==true){
        errors.consent="Please accept terms and conditions";
    }

    return {
        valid:Object.keys(errors).length===0,
        errors,
        data:{
            name,
            email,
            phone,
            studentNumber,
            universityRollNumber,
            year,
            branch,
            domainOfInterest,
            collegeOrganization,
            consent:data.consent
        }
    };
};

module.exports=validateRegistration;