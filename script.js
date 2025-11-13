const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");

//open and close cart.
cartIcon.addEventListener("click", () => cart.classList.add("active"));

cartClose.addEventListener("click", () => cart.classList.remove("active"));

//adding products to carts
const addCartButtons = document.querySelectorAll(".add-cart");
addCartButtons.forEach(button => {
    button.addEventListener("click", event => {
        const productBox = event.target.closest(".product-box");
        addToCart(productBox);
    });
});

const cartContent = document.querySelector(".cart-content");
const addToCart = productBox => {
    const productImgSrc = productBox.querySelector("img").src;
    const productTitle = productBox.querySelector(".product-title").textContent;
    const productPrice = productBox.querySelector(".price").textContent;
    
    const cartItems = cartContent.querySelectorAll(".cart-product-title");
    for(let item of cartItems){
        if (item.textContent === productTitle){
            alert("You already added this product");
            return;
        };
    };
    
    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    cartBox.innerHTML = `
      <img src="${productImgSrc}" class="cart-img">
        <div class="cart-detail">
            <h2 class="cart-product-title">${productTitle}</h2>
            <span class="cart-price">${productPrice}</span>
            <div class="cart-quantity">
                <button id="decrement">-</button>
                <span class="number">1</span>
                <button id="increment">+</button>
            </div>
        </div>
            <i class="ri-delete-bin-line cart-remove"></i>  
    `;
    
    cartContent.appendChild(cartBox);
    
    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
       cartBox.remove(); 
        
        updateTotalPrice();
        updateCartCount(-1);
    });
    
   cartBox.querySelector(".cart-quantity").addEventListener("click", event =>{
        const numberElement = cartBox.querySelector(".number");
        const decrementButton = cartBox.querySelector("#decrement");
        let quantity = numberElement.textContent;
        
        if (event.target.id === "decrement" && quantity > 1) {
            quantity--;
            if (quantity === 1){
                decrementButton.style.color = "#999";
            }
        }else if (event.target.id === "increment"){
            quantity++;
            decrementButton.style.color = "#333";
        }
        
        numberElement.textContent = quantity;
       updateTotalPrice();
        
    });
    updateTotalPrice();
    updateCartCount(1);
};

//Updating prices
function updateTotalPrice(){
  const totalPriceElement = document.querySelector(".total-price");
const cartBoxes = document.querySelectorAll(".cart-box");
let total = 0;
    
cartBoxes.forEach(cartBox => {
    const priceElement = cartBox.querySelector(".cart-price");
    const quantityElement = cartBox.querySelector(".number");
    const price = priceElement.textContent.replace("$", "");
    const quantity = quantityElement.textContent;
    total += price*quantity;
});
    totalPriceElement.textContent = `$${total}`;
};

//Display number of items added to cart.
let cartItemCount = 0;
function updateCartCount(change){
    const cartItemCountBadge = document.querySelector(".cart-item-count");
    cartItemCount += change;
    if (cartItemCount > 0){
        cartItemCountBadge.style.visibility = "visible";
        cartItemCountBadge.textContent = cartItemCount;
    } else{
        cartItemCountBadge.style.visibility = "hidden";
        cartItemCountBadge.textContent = "";
    }
    
                                                                }
