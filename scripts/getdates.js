const date = new Date();
const year = date.getFullYear();

const modified_text = document.lastModified;

const modified_element = document.querySelector("#lastModified");
modified_element.textContent += modified_text;

const firstParagraphInFooter = document.querySelector("footer p:first-child");
firstParagraphInFooter.innerHTML = `&copy; ${year}` + firstParagraphInFooter.innerHTML;
