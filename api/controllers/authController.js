const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Setup Twilio if available in env, else mock
let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.registerOrLogin = async (req, res) => {
  try {
    const { name, email, phone, gender, location } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required' });

    let user = await User.findOne({ where: { phone } });

    if (!user) {
      if (!name || !email || !gender) {
         return res.status(400).json({ error: 'Name, email, and gender are required for registration' });
      }
      user = await User.create({ 
        name, email, phone, gender, 
        locationLat: location?.lat, 
        locationLng: location?.lng,
        isVerified: true
      });
    } else {
      if (location) {
        user.locationLat = location.lat;
        user.locationLng = location.lng;
      }
      await user.save();
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    res.json({ 
      message: 'Login successful (OTP Disabled)', 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        walletBalance: user.walletBalance,
        tasteProfile: {
          vector: user.tasteVector,
          persona: user.tastePersona
        }
      }
    });
  } catch (err) {
    console.error('Error in registerOrLogin:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP are required' });

    const user = await User.findOne({ where: { phone } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    res.json({ 
      message: 'Verified successfully', 
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        walletBalance: user.walletBalance,
        tasteProfile: {
          vector: user.tasteVector,
          persona: user.tastePersona
        }
      }
    });
  } catch (err) {
    console.error('Error in verifyOTP:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { tasteProfile, walletBalance } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (tasteProfile) {
      user.tasteVector = tasteProfile.vector;
      user.tastePersona = tasteProfile.persona;
    }
    if (walletBalance !== undefined) user.walletBalance = walletBalance;

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
