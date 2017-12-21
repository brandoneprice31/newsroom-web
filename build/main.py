from sanic import Sanic
from sanic.response import html, redirect
from sanic.exceptions import NotFound
from validator.validator import is_mobile, is_http
from template_loader.template_loader import template

app = Sanic()

# static files
app.static('/static', './static')

# endpoints
@app.route("/")
async def index(request):
    return html(template('index.html').render())

@app.route("/healthcheck")
async def healthcheck(request):
    return html('success')

if __name__ == "__main__":
    print("Starting up newsroom-web v1.0")
    app.run(host="0.0.0.0", port=8081)
