const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

//Signup
exports.signUp = async (req,res) => {

    try{
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;
    
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                status: false,
                message: "All fields are required"
            })
        }

        if(password!==confirmPassword){
            return res.status(400).json({
                status: false,
                message: "Password not matched"
            })
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already registered"
            })
        }

        const response = await OTP.find({email}).sort({createdAt: -1}).limit(1);

        if(response.length === 0){
            return res.status(400).json({
                success: false,
                message: 'OTP not found'
            })
        }
        else if(otp !== response[0].otp){
            return res.status(400).json({
                success:false,
                message: "Invalid OTP"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        let approved = "";
        approved === "Instructor" ? (approved=false) : (approved=true);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully"
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered"
        })
    }
}

//Login
exports.login = async (req,res) => {
    
    try{
        const {email,password} = req.body;
        
        if(!email && !password){
            return res.status(403).json({
                status: false,
                message: "All feilds are required"
            })
        }
        
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                status: false,
                message: "User not registered."
            })
        }
        
        if(await bcrypt.compare(password,user.password)){
            
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }

            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn: "20h"
            });
            
            user.token = token;
            user.password = undefined;
            
            const options = {
                expires: new Date(Date.now()+3*24*60*60*1000),
                httpOnly: true
            }
            
            res.cookie("token",token,options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged In Successfully"
            })
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Password is incorrect"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Login failure"
        })
    }
}

//OTP
exports.sendOTP = async (req,res) => {

    try{
        const {email} = req.body;
        const user = await User.findOne({email});
        
        if(user){
            return res.status(401).json({
                status:true,
                message: "User already registered"
            })
        }

        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        console.log("OTP: ",otp);

        let result = await OTP.findOne({otp: otp});

        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets: false,
            });
        }

        const otpPayload = {email,otp};

        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body: ",otpBody);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//Change Password
exports.changePassword = async (req,res) => {
    try {
		const userDetails = await User.findById(req.user.id);                         // Get user data from req.user
		const { oldPassword, newPassword, confirmNewPassword } = req.body;            // Get old password, new password, and confirm new password from req.body

		const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password );                 // Validate old password
			 
		if(!isPasswordMatch) {                                  // If old password does not match, return a 401 (Unauthorized) error
			return res.status(401).json({ success: false, message: "The password is incorrect" });	 
		}

		if(newPassword !== confirmNewPassword) {                             // Match new password and confirm new password
            return res.status(401).json({ success: false, message: "The password and confirm password does not match" });	 
		}
		   
		const encryptedPassword = await bcrypt.hash(newPassword, 10);             // Update password
		const updatedUserDetails = await User.findByIdAndUpdate(req.user.id , { password: encryptedPassword } , { new: true });
                                                                                  // find user by id and then update password = encryptedPassword , here if you "const updatedUserDetails =" does not wirte this then also it not affect;
		 
		try {                                                          // Send notification email , here passwordUpdated is template of email which is send to user;
			const emailResponse = await mailSender(updatedUserDetails.email, passwordUpdated(updatedUserDetails.email, `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`));
			console.log("Email sent successfully:", emailResponse.response);
		   } 
        catch(error) {
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		return res.status(200).json({ success: true, message: "Password updated successfully" });         // Return success response 	 
	 } 
    catch(error) {
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
}