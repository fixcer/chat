function increaseNumberMessageGroup(divId) {
  let currentValue = +$(`right[data-chat = ${divId}]`)
    .find('span.show-number-members')
    .text();

  currentValue += 1;

  $(`right[data-chat = ${divId}]`)
    .find('span.show-number-members')
    .html(currentValue);
}
