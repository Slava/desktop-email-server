var link = "";
for (h in emailObj.payload.headers){
  header = emailObj.payload.headers[h]
  if (header.name == "List-unsubscribe"){
      link = header.value;
  }
}

var match = (link != "")
return {
  match: match,
  buttonText: "Unsubscribe from this email:",
  link: link
}
