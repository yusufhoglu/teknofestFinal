const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const app = express();
app.use(cors());
app.use(express.json());


const generateNonce = () => Math.floor(Math.random() * 1000000);
const sessions = {};

const requestNonce = (req, res) => {
    const { address } = req.body;
    const nonce = generateNonce();
    sessions[address] = nonce;
    res.json({ nonce });
};

const verifySignature = (req, res) => {
    const { address, signature } = req.body;
    const nonce = sessions[address];

    if (!nonce) {
        return res.status(400).send('Nonce bulunamadı');
    }

    // Mesajı imzalamak için kullanılan orijinal mesajı oluştur
    const message = `Nonce: ${nonce}`;
    // İmzanın doğru olup olmadığını doğrula
    const signerAddress = ethers.verifyMessage(message, signature);

    if (signerAddress.toLowerCase() === address.toLowerCase()) {
        // Giriş başarılı
        console.log("body",req.body);
        res.redirect('/home');
    } else {
        res.status(401).send('Geçersiz imza');
    }
};

module.exports = {requestNonce,verifySignature}
