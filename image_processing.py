import requests
import os
import boto3
import uuid
from dotenv import load_dotenv
from PIL import Image
from werkzeug.utils import secure_filename

class ImageProcessing:
    def __init__(self):
        load_dotenv()
        self.aws_bucket = os.environ.get("AWS_BUCKET")
        self.aws_region = os.environ.get("AWS_REGION")
        if (os.environ.get("PROD")) == "True":
            self.working_dir = "/var/www/chefs-cab/static/images"
        else:
            self.working_dir = ".\static\images"
        self.ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

    def allowed_file(self, filename):
        return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in self.ALLOWED_EXTENSIONS
    
    def image_convert(self, input_path, file_name, width, height):
        file_name = os.path.splitext(file_name)[0] + '.webp'
        output_path = os.path.join(self.working_dir, file_name)
        max_size = (width, height)
        with Image.open(input_path) as img:
            original_width, original_height = img.size
            aspect_ratio = original_width / original_height
            new_width, new_height = max_size
            if original_width > original_height:
                new_height = int(new_width / aspect_ratio)
            else:
                new_width = int(new_height * aspect_ratio)
            resized_img = img.resize((new_width, new_height))
            resized_img.save(output_path, 'webp')
        return output_path

    def download_userIMG(self, file):
        if file and self.allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_name = os.path.join(self.working_dir, filename)
            file.save(file_name)
        return file_name

    def download_image(self, image_url):
        new_filename = uuid.uuid4().hex + ".jpg"
        filename = os.path.join(self.working_dir, new_filename)
        img_data = requests.get(image_url).content
        with open(filename, 'wb') as handler:
            handler.write(img_data)
        return filename

    def upload_file(self, filename):
        s3 = boto3.resource(
            "s3",
            aws_access_key_id=os.environ.get("AWS_ACCESS_KEY"),
            aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
            region_name=self.aws_region
        )
        new_filename = uuid.uuid4().hex + '.webp'
        output_path = self.image_convert(filename, new_filename, 400, 400)
        with open(output_path, "rb") as file:
            s3.Bucket(self.aws_bucket).upload_fileobj(file, new_filename)
        file_url = f"https://{self.aws_bucket}.s3.{self.aws_region}.amazonaws.com/{new_filename}"
        os.remove(output_path)
        os.remove(filename)
        return file_url
    
    def upload_profile(self, filename):
        s3 = boto3.resource(
            "s3",
            aws_access_key_id=os.environ.get("AWS_ACCESS_KEY"),
            aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
            region_name=self.aws_region
        )
        new_filename = uuid.uuid4().hex + '.webp'
        output_path = self.image_convert(filename, new_filename, 150, 150)
        with open(output_path, "rb") as file:
            s3.Bucket(self.aws_bucket).upload_fileobj(file, new_filename)
        file_url = f"https://{self.aws_bucket}.s3.{self.aws_region}.amazonaws.com/{new_filename}"
        os.remove(output_path)
        os.remove(filename)
        return file_url
