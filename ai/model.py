import os
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Flatten, Dense, Dropout
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.optimizers import Adam


import numpy as np
# Dizin yollarını tanımlayın
base_dir = 'data'
real_dir = os.path.join(base_dir, 'real')
fake_dir = os.path.join(base_dir, 'fake')

# Dizinleri oluşturun
os.makedirs(real_dir, exist_ok=True)
os.makedirs(fake_dir, exist_ok=True)


# Veri artırma ve ön işleme için ImageDataGenerator kullanın
datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    validation_split=0.2
)

# Eğitim verileri yükleyici
train_generator = datagen.flow_from_directory(
    base_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='binary',
    subset='training')

# Doğrulama verileri yükleyici
validation_generator = datagen.flow_from_directory(
    base_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='binary',
    subset='validation')


# Önceden eğitilmiş ResNet50 modeli
base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Modelin üzerine özelleştirilmiş katmanlar ekledik

model = Sequential([
    base_model,
    Flatten(),
    Dense(256 , activation='relu'),
    Dropout(0.5),
    Dense(1, activation='sigmoid')
])

# Model derlemesi
model.compile(optimizer=Adam(), loss='binary_crossentropy', metrics=['accuracy'])
# model.compile(optimizer=Adam(learning_rate=1e-4), loss='binary_crossentropy', metrics=['accuracy'])

# Model eğitimi
model.fit(train_generator, epochs=10, validation_data=validation_generator)

model.save('model_last.keras')


