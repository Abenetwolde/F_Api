import express, { Request, Response } from 'express';

import User from '../model/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
exports.createUser = async (req: Request, res: Response) => {
    console.log("hit the create user api")

    try {
        let user = await User.findOne({ telegramid: req.body.telegramid });
        if (user) {
            return res.json({ token: user.token, message: 'User already registered.' });

        } else {
            const telegramId = req.body.telegramid
            const token = jwt.sign(
                { userId: telegramId },
                process.env.JWT_TOKEN_SECRET_KEY || "abnet",
                { expiresIn: "7d" }
            );
            // const token = jwt.sign({ telegramId }, 'your_secret_key');
            user = new User({
                telegramid: req.body.telegramid,
                name: req.body.name,
                last: req.body.last,
                token: token
            })
            user = await user.save();

            res.status(201).json({
                success: true,
                user
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }

};
exports.getUserDetails = async (req: Request, res: Response) => {
    console.log("hit the getUserDetails user api")

    try {
        const user = await User.findOne({ telegramid: req.params.telegramid });
        if (user) {
            res.status(200).json({
                success: true,
                user,
            });
        } else {
            res.status(500).json({
                success: false,
                message: "user not found!"
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }


}
exports.updateUserDetails = async (req: Request, res: Response) => {
    console.log("hit the updateUserDetails user api", req.body)

    try {
        let user = await User.findOne({ telegramid: parseInt(req.params.telegramid)});
        console.log("User.$where..........", user)
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }
   
       const  muser = await User.findOneAndUpdate({ telegramid: parseInt(req.params.telegramid) },
          req.body ,{ new: true });
      
        if (!muser) {
            return res.status(400).json({ success: false, message: 'User update failed!' });
        }

        res.status(200).json({
            success: true,
            user:muser
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error!' });
    }


}
exports.deleteAuser = async (req: Request, res: Response) => {
    console.log("hit the delete user api")
    try {
        let user = await User.findOne({ telegramid: req.params.telegramid });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }

        user = await User.findByIdAndDelete(user._id).lean();

        if (!user) {
            return res.status(400).json({ success: false, message: 'User deletion failed!' });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully!'
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error!' });
    }


}
exports.getAllAuser = async (req: Request, res: Response) => {
    console.log("hit the get all user api")
    try {
        // Parse the page and pageSize query parameters
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10; // Adjust the default page size as needed/ Adjust the default page size as needed

        // Calculate the number of products to skip
        const skip = (page - 1) * pageSize;
        let users = await User.find().skip(skip)
            .limit(pageSize);
        const count = await User.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(count / pageSize);
        if (users) {
            res.status(201).json({
                success: true,
                users,
                count,
                page,
                pageSize,
                totalPages,
            });
        }

    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error!' });
    }


}

exports.AddsFavorite = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.favorites.push(req.body.productId);
        await user.save();
        res.status(201).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ error: "server error" });
    }
};
exports.RemovesFavorite = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.favorites = user.favorites.filter((fav) => fav.toString() !== req.params.productId);
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "server error" });
    }
};
exports.adminLogin = async (req: Request, res: Response) => {
    console.log("hit the adminlogin api")
    try {
        const { email, password } = req.body;
        const query = { email: email };
        const user = await User.findOne(query);

        if (!user) {
            return res.status(404).json({ message: "User Doestn't Exist. Try Sign Up!" });
        }

        if (user && await bcrypt.compare(password, user.password)) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.JWT_TOKEN_SECRET_KEY || "abnet",
                {
                    expiresIn: "1d",
                }
            );

            await User.findOneAndUpdate(
                { email: email },
                { token: token },
                { new: true }
            );
            return res.status(200).json({ User: user });
        }
        res.status(400).send("Invalid Credentials");
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

exports.adminCreate = async (req: Request, res: Response) => {
    console.log("hit the admin create api")
    let userData = req.body;
    const { email, password } = req.body;

    const phoneORemailExist = await User.findOne({
        email: email
    });

    if (phoneORemailExist) {
        return res
            .status(400)
            .send({ message: "PHONE_EMAIL_ALREADY_EXISTS_ERR" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    userData.password = encryptedPassword;

    const newUser = await User.create(userData);
    const token = jwt.sign(
        { user_id: newUser._id, email },
        process.env.JWT_TOKEN_SECRET_KEY || "abnet",
        {
            expiresIn: "1d",
        }
    );
    newUser.token = token;
    res
        .status(201)
        .send({
            user: newUser,
            message: "Account Created Saved Succesfully !",
        });

}


