from django.core.mail import send_mail
from django.template import Context
from django.template.loader import get_template


def send_template_mail(to, subject, template_name, context, from_mail, from_password):
    plain_text = get_template(template_name + '.txt')
    html_text = get_template(template_name + '.html')

    send_mail(
        subject,
        plain_text.render(context),
        from_mail,
        [to],
        auth_user=from_mail,
        auth_password=from_password,
        html_message=html_text.render(context)
    )
