const navLinks = document.getElementsByClassName("ratingNavigationLink");
const navForm = document.getElementById("ratingNavigationForm");
const targetPageInput = document.getElementById("targetNavPage");
console.log("debugging1");
for (let i = 0; i<navLinks.length; i++){
    navLinks[i].addEventListener("click",submitNavForm);
    console.log("debugging2");
};
function submitNavForm(){
    const incrementStartRow = Number(this.dataset.increment);
    startRow += incrementStartRow;
    targetPageInput.setAttribute("value",startRow.toString());
    console.log(startRow);
    console.log(document.getElementById("targetNavPage"));
    navForm.submit();
}