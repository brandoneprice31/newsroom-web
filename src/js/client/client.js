import $ from "jquery";

const BASE_URL = "http://localhost:8080/"

class Client {
  static get(url, params, successHandler, errorHandler) {
    $.ajax({
      url: BASE_URL + url,
      data: params,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        successHandler(data);
      },
      error: function(xhr, status, err) {
        errorHandler(err);
      }
    });
  }

  static post(url, data, successHandler, errorHandler) {
    $.ajax({
      type: 'POST',
      url: BASE_URL + url,
      data: JSON.stringify(data),
      dataType: 'json',
      beforeSend: function(x) {
        if (x && x.overrideMimeType) {
          x.overrideMimeType("application/j-son;charset=UTF-8");
        }
      },
      success: function(data) {
        successHandler(data);
      },
      error: function(data) {
        errorHandler(data);
      }
    });
  }
}

export default Client;
