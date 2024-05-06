export function getText(element) {
    const clone = element.cloneNode(true);
    clone.querySelectorAll('.edit_btn, .remove_btn, .delete_btn').forEach(button => {
        button.remove();
    });
    const text = clone.textContent.trim();
    return text;
}