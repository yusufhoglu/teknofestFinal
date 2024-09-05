from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import requests
from io import BytesIO
import sys
import os
# os.environ['TF_ENABLE_ONEDNN_OPTS'] = '2'

model_path = os.path.join('ai', 'model.keras')
# model_path = "model.keras"
try:
    model = load_model(model_path)
except Exception as e:
    print(f"Error loading model: {e}")
image_url = sys.argv[1]

def detect_ai_generated(image_path):
    # # Cloudinary linkinden resmi indir
    response = requests.get(image_path)
    img = image.load_img(BytesIO(response.content), target_size=(224, 224))

    # img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0

    prediction = model.predict(img_array,verbose=None)*100000
    print (prediction[0][0])
    # if prediction[0][0] > 1:
    #     print(prediction[0])
    #     print("Real")
    # else:
    #     print(prediction[0])
    #     print("AI-generated")
        


# Örnek kullanım
detect_ai_generated(image_url)