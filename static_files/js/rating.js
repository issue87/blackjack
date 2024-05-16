const navLinks = document.getElementsByClassName("ratingNavigationLink");
const navForm = document.getElementById("ratingNavigationForm");
const targetPageInput = document.getElementById("targetNavPage");
for (let i = 0; i<navLinks.length; i++){
    navLinks[i].addEventListener("click",submitNavForm);
    startRow += incrementStartRow;
}
function submitNavForm(){
    const incrementStartRow = Number(this.dataset.incrementStartRow);
    console.log(typeof(incrementStartRow));
    console.log(incrementStartRow);
    startRow += incrementStartRow;
    console.log(typeof(startRow));
    console.log(startRow);
    targetPageInput.setAttribute("value",startRow.toString());
    //navForm.submit();
}