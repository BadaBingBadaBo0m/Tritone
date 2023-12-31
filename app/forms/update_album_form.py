from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField
from wtforms.validators import DataRequired, Email, ValidationError
from flask_wtf.file import FileField, FileAllowed, FileRequired
# from ..api.AWS_helpers import ALLOWED_EXTENSIONS
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg" }

class UpdateAlbumForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    # artists = StringField('Artists')
    description = TextAreaField('Description')
    art = FileField("Album Art", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])

# for the form add an encryption type timestamp 1:05:00