APP = (function (window, document) {

  var init = function () {
    bindCheckout()
    bindMoreBreads()
    bindPlusMinus()
    keyupCountInput()
    if($('.index').length) {
      getBreads()
    }

    submitCheckCoupon()
    submitCheckout()
    keyupOrderInput()

    if($('.order').length && $('.order-input').val() !== '') {
      $('.order-input').trigger('keyup')
    }
  }

  var bindCheckout = function() {
    $(document).on('click', '.checkout-btn', function() {
      $('.checkout').removeClass('none')
      $('.products').addClass('none')
      $('footer').addClass('none')

      $("html, body").animate({ scrollTop: 0 }, "fast")

      var couponCode = $('.coupon-form input').val()

      if(!_.isEmpty(couponCode)) {
        $('.coupon-form').trigger('submit')
      }

      checkAvaibility()

      return false
    })
  }

  var bindMoreBreads = function() {
    $(document).on('click', '.back-btn', function() {
      $('.checkout').addClass('none')
      $('.products').removeClass('none')
      $('footer').removeClass('none')

      $("html, body").animate({ scrollTop: 0 }, "fast")

      return false
    })
  }

  var bindPlusMinus = function() {
    $(document).on('click', '.control-count', function(e) {
      var inputEl = $(this).closest('.product').find('input')
      var currentTotal = parseInt($(inputEl).val()) || 0

      if($(this).hasClass('minus-btn')) {
        if(currentTotal > 0) {
          $(inputEl).val(currentTotal-1)
        } else {
          $(inputEl).val(0)
        }
      } else {
        $(inputEl).val(currentTotal+1)
      }

      calculateTotalBread()
      orderList()
    })
  }

  var keyupCountInput = function() {
    $(document).on('keyup', '.count input', function() {
      var count = $(this).val()
      if(count !== '') {
        $(this).val(count.replace(/\D/g,''))
        $(this).val(parseInt(count, 10))
      }

      calculateTotalBread()
      orderList()
    })
  }

  var calculateTotalBread = function() {
    var totalBread = 0
    $('.count input').each(function(i, item) {
      var currentEl = $(item)
      var countVal = parseInt(currentEl.val())
      if(!_.isNumber(countVal) || currentEl.val() === '') {
        console.log('here')
        currentEl.val(0)
      } else {

        totalBread += countVal
      }

      if(totalBread <= 0) {
        $('.nobreads').removeClass('none')
        $('.total-breads').addClass('none')
        $('.checkout-btn').addClass('none')
      } else {
        $('.nobreads').addClass('none')
        $('.total-breads').removeClass('none')
        $('.checkout-btn').removeClass('none')
      }

      $('.total-breads--count').text(totalBread)
    })
  }

  var orderList = function() {
    var subtotal = 0
    $('.count input').each(function(i, item) {
      var currentEl = $(item)
      var countVal = parseInt(currentEl.val())

      if(_.isNumber(countVal) && currentEl.val() !== '' && currentEl.val() !== '0') {
        var id = $(item).closest('.product').attr('data-id')
        var picture = $(item).closest('.product').find('.picture').css('background-image').replace('url(','').replace(')','').replace(/\"/gi, "");
        var name = $(item).closest('.product').attr('data-name')
        var price = $(item).closest('.product').attr('data-price')
        var count = countVal
        var totalPricePerList = price*count

        if($('.product-ordered--list tbody tr[data-pid='+id+']').length) {
          $('.product-ordered--list tbody tr[data-pid='+id+'] .product-ordered--price-text').text(GENERAL.currency(totalPricePerList))
          $('.product-ordered--list tbody tr[data-pid='+id+'] .product-ordered--count-text').text(GENERAL.currency(count))
        } else {
          $('.product-ordered--list tbody').append('<tr data-pid="'+id+'"><td><div class="product-ordered--image" style="background-image: url('+picture+')"></div></td><td><p class="product-ordered--desc">'+name+'</p></td><td><p class="product-ordered--count"><span class="product-ordered--count-text">'+count+'</span><small class="availability-status">Checking availability...</small></p></td><td><p class="product-ordered--price">Rp <span class="product-ordered--price-text">'+GENERAL.currency(price*count)+'</span></p></td></tr>')
        }

        subtotal += totalPricePerList

        $('.product-ordered--list tbody tr[data-pid='+id+']').attr('data-count', count)
        $('.product-ordered--list tbody tr[data-pid='+id+']').attr('data-price', price)
        $('.product-ordered--list tbody tr[data-pid='+id+']').attr('data-total', totalPricePerList)
        $('.product-ordered--total-subtotal').text(GENERAL.currency(subtotal))

        var totalFinal = parseInt($('.product-ordered--total-subtotal').text().replace(/,/g, '')) + parseInt($('.product-ordered--total-shipping').text().replace(/,/g, '')) - parseInt($('.product-ordered--total-coupon').text().replace(/,/g, ''))
        $('.product-ordered--total-final').text(GENERAL.currency(totalFinal))
      } else {
        var id = $(item).closest('.product').attr('data-id')
        $('.product-ordered--list tbody tr[data-pid='+id+']').remove()
      }
    })
  }

  var getBreads = function() {
    $.ajax({
      url: '/api/breads',
      method: 'GET',
      dataType: 'json'
    })
    .done(function(res) {
      var data = res.data

      _.forEach(data, function(item, i) {
        var soldOutClass = item.amount <= 0 ? ' soldout' : ''
        var soldOutControl = item.amount <= 0 ? '<div class="soldout-label">SOLD OUT</div>' : '<div class="control"><div class="control-count minus-btn">-</div><div class="count"><input type="text" value="0"></div><div class="control-count plus-btn">+</div></div>'

        $('.products').append('<div class="product'+soldOutClass+'" data-id="'+item._id+'" data-name="'+item.name+'" data-price="'+item.price+'"><div class="picture" style="background-image: url('+item.image+')"></div>'+soldOutControl+'</div>')
      })
    })
    .fail(function(res) {
      console.log(res)
    })
  }

  var getData = function(e) {
    $.ajax({
      url: 'http://jsonplaceholder.typicode.com/posts',
      method: 'GET',
      dataType: 'json'
    })
    .done(function(res) {
      $('.total-question--count').text(res.length)

      var result = _.chain(res)
      .groupBy("userId")
      .pairs()
      .map(function(currentItem) {
          return _.object(_.zip(["user", "question"], currentItem));
      })
      .value();

      $('.total-user--count').text(result.length)

      _.forEach(result, function(rItem, i) {
        var userQuestion = ''
        _.forEach(rItem.question, function(qItem, i) {
          userQuestion += '<div class="question" data-id="'+qItem.id+'"><p class="question--title">'+qItem.title+'</p><p class="question--text">'+qItem.body+'</p></div>'
        })

        $('.search-result').append('<article><div class="user-image"><img src="http://lorempixel.com/200/200/people" alt=""></div><div class="user-questions">'+userQuestion+'</div></div></article>')
      })

      getComment();
    })
    .fail(function(res) {
      console.log(res)
    })
  }

  var submitCheckCoupon = function() {
    $(document).on('submit', '.coupon-form', function(e) {
      e.preventDefault();
      var couponCode = $('.coupon-form input').val()

      var _this = $(this);
      var url = _this.attr('action') + couponCode;

      if(couponCode === '') {
        GENERAL.notifier('Enter your coupon code', 'error')
        GENERAL.resetBtn(_this, 'Use coupon')
      } else {
        $.ajax({
          url: url,
          method: 'GET',
          dataType: 'json'
        })
        .done(function(res) {
          var data = res.data

          if(_.isEmpty(data)) {
            GENERAL.notifier('Coupon code no longer active', 'error')
            $('.product-ordered--total-coupon').text(0)
            $('.product-ordered--total-percentage').text('')
            $('.shipping-form input[name="coupon"]').val('')
            orderList()
            GENERAL.resetBtn(_this, 'Use coupon')
          } else {
            GENERAL.notifier('Your coupon code has been applied', 'success')

            var subtotal = $('.product-ordered--total-subtotal').text().replace(/,/g, '')
            var coupon = subtotal*(data.percentage/100)
            $('.product-ordered--total-coupon').text(GENERAL.currency(coupon))
            $('.product-ordered--total-percentage').text(['-', data.percentage, '%'].join(''))
            $('.shipping-form input[name="coupon"]').val(data._id)
            orderList()
            GENERAL.resetBtn(_this, 'Use coupon')
          }
        })
        .fail(function(res) {
          console.log(res)
          GENERAL.resetBtn(_this, 'Use coupon')
        })
      }

      return false
    })
  }

  var checkAvaibility = function() {
    $('.availability-status').text('Checking availability...')
    $('.availability-status').removeClass('empty')

    $('.product-ordered--list tr').each(function(i, item) {
      var currentEl = $(item)
      var productId = currentEl.attr('data-pid')
      var productCount = parseInt(currentEl.attr('data-count'))

      $.ajax({
        url: '/api/breads/check/' + productId,
        method: 'GET',
        dataType: 'json'
      })
      .done(function(res) {
        var data = res.data
        var currentStock = data.amount

        if(productCount <= currentStock) {
          currentEl.find('.availability-status').text('Available')
          currentEl.attr('data-available', 'true')
        } else {
          currentEl.find('.availability-status').text('Only left ' + currentStock)
          currentEl.find('.availability-status').addClass('empty')
          currentEl.attr('data-available', 'false')
        }
      })
      .fail(function(res) {
        currentEl.find('.availability-status').text('There was a problem while checking the stock')
        currentEl.find('.availability-status').addClass('empty')
      })
      var countVal = parseInt(currentEl.val())
    })
  }

  var submitCheckout = function() {
    $(document).on('submit', '.shipping-form', function(e) {
      e.preventDefault();

      var _this = $(this);
      var url = _this.attr('action');

      var data = {
        name: _this.find('input[name="name"]').val(),
        phone: _this.find('input[name="phone"]').val(),
        email: _this.find('input[name="email"]').val(),
        address: _this.find('textarea[name="address"]').val(),
        coupon: _this.find('input[name="coupon"]').val()
      }

      if(validator.isNull(data.name) || validator.isNull(data.name) || !validator.isEmail(data.email) || validator.isNull(data.address)) {
        GENERAL.notifier('Shipping details fields can\'t be empty', 'error')
        GENERAL.resetBtn(_this, 'Submit order')
      } else {
        var totalNotAvailable = $('.product-ordered--list tr[data-available="false"]').length
        if(totalNotAvailable) {
          GENERAL.notifier(totalNotAvailable + ' order item not available, buy another', 'error')
          GENERAL.resetBtn(_this, 'Submit order')
        } else {
          var orderItems = []
          $('.product-ordered--list tr[data-available="true"]').each(function(i, item) {
            var currentEl = $(item)
            var orderItem = {
              product: currentEl.attr('data-pid'),
              count: currentEl.attr('data-count'),
              price: currentEl.attr('data-price')
            }

            orderItems.push(orderItem)
          })

          data.items = JSON.stringify(orderItems)

          $.ajax({
            url: url,
            method: 'POST',
            dataType: 'json',
            data: data
          })
          .done(function(res) {
            var data = res.data

            GENERAL.resetBtn(_this, 'Redirecting...')
            window.location = '/order?id=' + data.orderId
          })
          .fail(function(res) {
            GENERAL.resetBtn(_this, 'Submit order')
          })
        }
      }

      return false
    })
  }

  var keyupOrderInput = function() {
    $(document).on('keyup', '.order-input', function() {
      var orderId = $(this).val().toLowerCase();

      GENERAL.delay(function() {
        if(orderId !== '') {
          $('.store-profile h3').text('Checking your order...')
          $.ajax({
            url: '/api/order/check/' + orderId,
            method: 'GET',
            dataType: 'json'
          })
          .done(function(res) {
            var data = res.data

            if(data.status === 1) {
              $('.store-profile h3').text('Breadstock has been recieved your order, please wait for verification')
            } else if(data.status === 2) {
              $('.store-profile h3').text('Your breads is on the way! Shipping number: ' + data.shippingCode)
            } else {
              $('.store-profile h3').text('Not found')
            }
          })
          .fail(function(res) {
            GENERAL.notifier('There was a problem while checking your order, try again.', 'error')
            $('.store-profile h3').text('')
          })
        } else {
          $('.store-profile h3').text('')
        }
      }, 500)
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