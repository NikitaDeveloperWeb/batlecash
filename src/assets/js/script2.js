function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, exp_y, exp_m, exp_d, path, domain, secure) {
  var cookie_string = name + "=" + escape(value);

  if (exp_y) {
    var expires = new Date(exp_y, exp_m, exp_d);
    cookie_string += "; expires=" + expires.toGMTString();
  }

  if (path)
    cookie_string += "; path=" + escape(path);

  if (domain)
    cookie_string += "; domain=" + escape(domain);

  if (secure)
    cookie_string += "; secure";

  document.cookie = cookie_string;
}

function validateBetSize(inp) {
  inp.value = inp.value.replace(/[,]/g, '.')
    .replace(/[^\d,.]*/g, '')
    .replace(/([,.])[,.]+/g, '$1')
    .replace(/^[^\d]*(\d+([.,]\d{0,2})?).*$/g, '$1');
}

function withdrawSelect() {
  $('#sub_wallet').val('');
  var e = $('#sub_list').val();
  if (e >= 4 && e <= 8) {
    $('#sub_wallet').attr('placeholder', '79123456789');
  }
  if (e == 4) {
    $('#sub_wallet').attr('placeholder', '+79995556767');
  }
  if (e >= 1 && e <= 3) {
    if (e == 2) {
      $('#sub_wallet').attr('placeholder', 'P1000000');
    }
    if (e == 1) {
      $('#sub_wallet').attr('placeholder', '410011499718000');
    }
    if (e == 3) {
      $('#sub_wallet').attr('placeholder', 'R123456789000');
    }
  }
  if (e >= 9) {
    if (e == 10) {
      $('#sub_wallet').attr('placeholder', '512107XXXX785577');
    } else {
      $('#sub_wallet').attr('placeholder', '412107XXXX785577');
    }
  }
}

function promo_minus(){
  $("#promo_minus").html($('#reward').val() * $('#count').val());
}
