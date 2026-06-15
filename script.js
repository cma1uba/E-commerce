// Initialize Pendo with anonymous visitor
pendo.initialize({
    visitor: {
        id: ''
    }
});

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
            pendo.track("duplicate_product_add_attempted", {
                productTitle: productTitle,
                productPrice: productPrice
            });
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
        const removedTitle = cartBox.querySelector(".cart-product-title").textContent;
        const removedPrice = cartBox.querySelector(".cart-price").textContent;
        const removedQuantity = cartBox.querySelector(".number").textContent;
        cartBox.remove();

        updateTotalPrice();
        updateCartCount(-1);

        pendo.track("product_removed_from_cart", {
            productTitle: removedTitle,
            productPrice: removedPrice,
            quantity: Number(removedQuantity),
            remainingCartItems: cartContent.querySelectorAll(".cart-box").length
        });
    });
    
   cartBox.querySelector(".cart-quantity").addEventListener("click", event =>{
        const numberElement = cartBox.querySelector(".number");
        const decrementButton = cartBox.querySelector("#decrement");
        let previousQuantity = Number(numberElement.textContent);
        let quantity = previousQuantity;

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

        if (quantity !== previousQuantity) {
            pendo.track("cart_quantity_changed", {
                productTitle: cartBox.querySelector(".cart-product-title").textContent,
                productPrice: cartBox.querySelector(".cart-price").textContent,
                previousQuantity: previousQuantity,
                newQuantity: quantity,
                direction: quantity > previousQuantity ? "increment" : "decrement"
            });
        }

    });
    updateTotalPrice();
    updateCartCount(1);

    pendo.track("product_added_to_cart", {
        productTitle: productTitle,
        productPrice: productPrice,
        productImageSrc: productImgSrc,
        cartItemCount: cartItemCount
    });
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

//Submit button message
const buyNowButton = document.querySelector(".btn-buy");
buyNowButton.addEventListener("click", () =>{
   const cartBoxes = cartContent.querySelectorAll(".cart-box");
    if (cartBoxes.length === 0){
        alert("Your cart is empty");
        return;
    }

    const totalPrice = document.querySelector(".total-price").textContent;
    const productTitles = [];
    const productPrices = [];
    const quantities = [];
    cartBoxes.forEach(cartBox => {
        productTitles.push(cartBox.querySelector(".cart-product-title").textContent);
        productPrices.push(cartBox.querySelector(".cart-price").textContent);
        quantities.push(Number(cartBox.querySelector(".number").textContent));
    });

    pendo.track("purchase_completed", {
        totalPrice: totalPrice,
        itemCount: cartBoxes.length,
        productTitles: productTitles,
        productPrices: productPrices,
        quantities: quantities
    });

    cartBoxes.forEach(cartBox => cartBox.remove());

    updateTotalPrice();
    cartItemCount = 0;
    updateCartCount(0);

    alert("Purchase succefully submited");
});
