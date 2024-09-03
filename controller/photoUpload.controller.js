const express = require('express');
const multer = require('multer');
const bs58 = require('bs58');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Photo = require('../model/Photo.model'); // Photo modelini import edin
const connectDB = require('../database'); // database.js dosyasını import edin
const { default: mongoose } = require('mongoose');
const { Connection, PublicKey, Keypair,Transaction, SystemProgram, clusterApiUrl,VersionedTransaction,sendAndConfirmTransaction } = require('@solana/web3.js');
const secretKeyBase58 = process.env.SOLANA_PRIVATE_KEY;
const secretKey = bs58.default.decode(secretKeyBase58);

const app = express();
connectDB();

// Cloudinary konfigürasyonu
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary hesap adınızı buraya girin
  api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API anahtarınızı buraya girin
  api_secret: process.env.CLOUDINARY_API_SECRET // Cloudinary API secretınızı buraya girin
});

// Multer ve Cloudinary için storage ayarları
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Cloudinary'de kaydedilecek klasör adı
    allowedFormats: ['jpg', 'png'], // Kabul edilen dosya formatları
  },
});

const upload = multer({ storage: storage });

const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');
const payer = Keypair.fromSecretKey(secretKey);
console.log('Payer Public Key:', payer.publicKey.toBase58());

app.use(express.static('public'));

// Fotoğraf yükleme işlevi
async function uploadPhoto(req, res) {
    if (req.file) {
        const newPhoto = new Photo({
            imageUrl: req.file.path,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
        });
        newPhoto.save()
            .then(() => {
                console.log('Fotoğraf başarıyla yüklendi ve veritabanına kaydedildi!');
                   // Phantom cüzdan adresini session'dan al
                const userPhantomWalletAddress ="E3Afs9oEGi51gYt4XLyTvNKqvzmKARcMuGfzjeLLqfNG";
                
                // Test ağına SOL transferi
                const recipientPublicKey = new PublicKey(userPhantomWalletAddress);
                const transaction = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: payer.publicKey,
                        toPubkey: recipientPublicKey,
                        lamports: 10 // 1 SOL (Lamport cinsinden)
                    })
                );
                // const transaction = new VersionedTransaction({
                //   feePayer: payer.publicKey,
                //   recentBlockhash:connection.getLatestBlockhash(),
                // });
                // transaction.add(
                //   SystemProgram.transfer({
                //     fromPubkey: payer.publicKey,
                //     toPubkey: recipientPublicKey,
                //     lamports: 10 // 1 SOL = 1_000_000_000 lamports
                //   })
                // );
                // transaction.sign(payer);

                try {
                  // İşlemi gönderme
                  const signature = sendAndConfirmTransaction(connection, transaction, [payer], {
                    skipPreflight: false,
                    commitment: 'confirmed', // veya 'processed', 'finalized'
                  });
              
                  console.log('Transaction successful with signature:', signature);
                } catch (error) {
                  console.error('Transaction failed:', error);
                }
                res.json({
                    message: 'Fotoğraf başarıyla yüklendi ve veritabanına kaydedildi!',
                    imageUrl: req.file.path,
                });
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ error: 'Veritabanına kaydedilirken bir hata oluştu!' });
            });
        
        
    } else {
        res.status(400).json({ error: 'Fotoğraf yüklenemedi!' });
    }
  };

 // Tüm fotoğrafları döndüren işlev
function getAllPhotos(req, res) {
  Photo.find()
      .then(photos => {
        console.log(photos)
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({ error: 'Verileri getirirken bir hata oluştu!' });
      });
}

module.exports = { upload, uploadPhoto, getAllPhotos };
