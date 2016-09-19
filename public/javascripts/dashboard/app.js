APP = (function (window, document) {

  var init = function () {
    bindStatusBtn()
    if($('.dashboard-index').length) {
      getOrders()
    }
    bindOrderId()
    bindOtherOrder()
    submitShipping()
  }

  var bindStatusBtn = function() {
    $(document).on('click', '.status-btn-container a', function() {
      var statusCode = $(this).attr('data-status')
      $('.status-btn-container a').removeClass('active')
      $(this).addClass('active')

      if(statusCode === '') {
        $('.orderlist-order a').removeClass('none')
        $('.total-list').text($('.orderlist-order a').length)
      } else {
        $('.orderlist-order a').addClass('none')
        $('.orderlist-order a[data-status="'+statusCode+'"]').removeClass('none')
        $('.total-list').text($('.orderlist-order a[data-status="'+statusCode+'"]').length)
      }

      return false
    })
  }

  var getOrders = function() {
    $.ajax({
      url: '/api/orders',
      method: 'GET',
      dataType: 'json'
    })
    .done(function(res) {
      var data = res.data

      _.forEach(data, function(item, i) {
        $('.orderlist-order').append('<a href="#" data-oid="'+item._id+'" data-status="'+item.status+'">#<span class="txt-uc">'+item.orderId+'</span><span class="total">'+item.totalItem+' items</span></a>')
      })

      $('.status-btn-container a[data-status="1"]').trigger('click')
    })
    .fail(function(res) {
      console.log(res)
    })
  }

  var bindOrderId = function() {
    $(document).on('click', '.orderlist-order a', function() {
      var orderId = $(this).attr('data-oid')
      $('.product-ordered--list tbody').empty()
      $('.product-ordered--total-coupon').text(0)
      $('.product-ordered--total-percentage').text('')
      $('.product-ordered--total-subtotal').text(0)

      $('.orderlist').addClass('none')
      $('.shipping').removeClass('none')

      $.ajax({
        url: '/api/orders/' + orderId,
        method: 'GET',
        dataType: 'json'
      })
      .done(function(res) {
        var data = res.data
        $('.orderid').text(data.order.orderId)
        $('.shipping-name').text(data.order.name)
        $('.shipping-phone').text(data.order.phone)
        $('.shipping-email').text(data.order.email)
        $('.shipping-address').text(data.order.address)
        $('.shipping-oid').val(data.order._id)
        $('.shipping-code').val(data.order.shippingCode)

        _.forEach(data.orderItem, function(item, i) {
          $('.product-ordered--list tbody').append('<tr><td><div class="product-ordered--image" style="background-image: url('+item.product.image+')"></div></td><td><p class="product-ordered--desc">'+item.product.name+'</p></td><td><p class="product-ordered--count"><span class="product-ordered--count-text">'+item.count+'</span></p></td><td><p class="product-ordered--price">Rp <span class="product-ordered--price-text">'+GENERAL.currency(item.price*item.count)+'</span></p></td></tr>')
        })

        var subtotal = 0
        $('.product-ordered--price-text').each(function(i, item) {
          var total = $(item).text().replace(/,/g, '')
          subtotal += parseInt(total)
        })
        $('.product-ordered--total-subtotal').text(GENERAL.currency(subtotal))

        if(data.order.coupon) {
          var coupon = subtotal*(data.order.coupon.percentage/100)
          $('.product-ordered--total-coupon').text(GENERAL.currency(coupon))
          $('.product-ordered--total-percentage').text(['-', data.order.coupon.percentage, '%'].join(''))
        } else {
          console.log('gak ada kupon');
          $('.product-ordered--total-coupon').text(0)
          $('.product-ordered--total-percentage').text('')
        }

        var totalFinal = subtotal + parseInt($('.product-ordered--total-shipping').text().replace(/,/g, '')) - coupon || 0
        $('.product-ordered--total-final').text(GENERAL.currency(totalFinal))

        $("html, body").animate({ scrollTop: 0 }, "fast")
      })
      .fail(function(res) {
        console.log(res)
      })

      return false
    })
  }

  var bindOtherOrder = function() {
    $(document).on('click', '.back-btn', function() {
      $('.orderlist').removeClass('none')
      $('.shipping').addClass('none')

      $("html, body").animate({ scrollTop: 0 }, "fast")

      return false
    })
  }

  var submitShipping = function() {
    $(document).on('submit', '.shipping-form', function(e) {
      e.preventDefault();

      var _this = $(this);
      var url = _this.attr('action');

      var data = {
        shippingCode: _this.find('input[name="shippingCode"]').val(),
        oid: _this.find('input[name="oid"]').val()
      }

      if(validator.isNull(data.shippingCode)) {
        GENERAL.notifier('Shipping code can\'t be empty', 'error')
        GENERAL.resetBtn(_this, 'Submit')
      } else {
        $.ajax({
          url: url,
          method: 'POST',
          dataType: 'json',
          data: data
        })
        .done(function(res) {
          var data = res.data
          console.log(data);

          $('.orderlist-order a[data-oid="'+data._id+'"]').attr('data-status', '2')
          $('.status-btn-container a[data-status="1"]').trigger('click')

          GENERAL.notifier('Shipping code has been submitted successfully', 'success')
          $('.back-btn').trigger('click')
          GENERAL.resetBtn(_this, 'Submit')
        })
        .fail(function(res) {
          console.log(res);
          GENERAL.resetBtn(_this, 'Submit')
        })
      }

      return false
    })
  }

  return {
    init: init
  };

})(window, document);

$(function () {
  APP.init();
});
;GENERAL = (function (window, document) {

  var init = function () {
    notifier()
    fadeOutRenderMessages()
    getUuid()
    keyupPhoneNumber()
  }

  var notifier = function(message, type) {
    $('.ajax-messages').hide()

    $('.'+type+'-msg-ajax').show()
    $('.'+type+'-msg-ajax p').text(message)

    setTimeout(function() {
      $('.'+type+'-msg-ajax').fadeOut(500)
    }, 5000)
  }

  var fadeOutRenderMessages = function() {
    if($('.render-messages').length) {
      setTimeout(function() {
        $('.render-messages').fadeOut(500)
      }, 3000)
    }
  }

  var getUuid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  }

  var getParameterByName = function(name, url) {
    if (!url) url = window.location.href
    name = name.replace(/[\[\]]/g, "\\$&")
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, " "))
  }

  var capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  var currency = function(str) {
    return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  var delay = (function(){
    var timer = 0
    return function(callback, ms){
      clearTimeout (timer)
      timer = setTimeout(callback, ms)
    }
  })()

  var keyupPhoneNumber = function() {
    $(document).on('keyup focus', 'input.phone-validator', function () {
      var _this = $(this)
      var phoneNumber = $(this).val()

      delay(function() {
        if(phoneNumber.substring(0, 3) !== '+62') {
          if(_this.prop('required')) {
            _this.val('+62')
          } else {
            if(phoneNumber !== '') {
              _this.val('+62')
            }
          }
        }
      }, 500)
    })
  }

  var resetBtn = function(el, text) {
    el.find('button').prop("disabled", false);
    el.find('button').text(text);
  }

  return {
    init: init,
    notifier: notifier,
    getUuid: getUuid,
    getParameterByName: getParameterByName,
    capitalize: capitalize,
    delay: delay,
    currency: currency,
    resetBtn: resetBtn
  }

})(window, document)

$(function () {
  GENERAL.init()
})