import re

def is_mobile(request):
    """Return True if the request comes from a mobile device."""
    MOBILE_AGENT_RE=re.compile(r".*(iphone|mobile|androidtouch)",re.IGNORECASE)
    return MOBILE_AGENT_RE.match(request.headers['user-agent'])

def is_https(request):
    return 'X-Forwarded-Proto' in request.headers and 'https' == request.headers['X-Forwarded-Proto']
