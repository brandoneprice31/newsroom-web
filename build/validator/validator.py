import re

def is_mobile(request):
    """Return True if the request comes from a mobile device."""
    MOBILE_AGENT_RE=re.compile(r".*(iphone|mobile|androidtouch)",re.IGNORECASE)
    return MOBILE_AGENT_RE.match(request.headers['user-agent'])

def is_http(request):
    return 'X-Forwarded-Proto' in request.headers and 'http' == request.headers['X-Forwarded-Proto']
