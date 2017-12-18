from sanic import Sanic
from sanic.response import html, redirect
from sanic.exceptions import NotFound
from validator.validator import is_mobile, is_http
from template_loader.template_loader import template

app = Sanic()

# static files
app.static('/static', './static')

# middlewares
@app.middleware('request')
async def redirect_host_urls(request):
    if 'localhost' in request.url:
        return None
    if is_http(request):
        return redirect('https://' + request.url[len('http://'):])

# endpoints
@app.route("/")
async def index(request):
    return html(template('index.html').render())

if __name__ == "__main__":
    print("Starting up newsroom-web...")
    app.run(host="0.0.0.0", port=8081)
