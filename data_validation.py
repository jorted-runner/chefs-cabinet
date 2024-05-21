import bleach

class Data_Validation:
    def clean_input(data):
        cleaned_data = bleach.clean(data)
        return cleaned_data
