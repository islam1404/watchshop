// modal
const modalTrrigger =  document.querySelector('.btn__create')
      modal = document.querySelector('.modal')
      modalClose = document.querySelector('.modal__close')

modalTrrigger.addEventListener('click' , modalChange)

function modalChange(){
    modal.classList.add('show')
    modal.classList.remove('hide')
    document.body.style.overflow = 'hidden'
}

modalClose.addEventListener('click' , ()=>{
    modal.classList.add('hide')
    modal.classList.remove('show')
    document.body.style.overflow = ''
})
// basket
let basket = []
let openBasket = document.querySelector('.basket__icon')
let basketCount = document.querySelector('.basket__count')
let basketProduct = document.querySelector('.basket')
let basketClose = document.querySelector('.basket__close')
let basketRow = document.querySelector('.basket__row')
let basketTotal = document.querySelector('.total')
let basketSale = document.querySelector('.sale')

openBasket.addEventListener('click', ()=>{
     basketProduct.style.display = 'block'
     const addForBasket = ()=>{
        basketRow.innerHTML = '' 
        basket.map((item)=>{
            basketRow.innerHTML += `
            <div class="basket__card">
            <img src="${item.image}" alt="">
            <div>
                <h3>${item.title}</h3>
                <p>${item.price}$</p>
                <div class="basket__count">
                    <button>+</button>
                    <span>${item.count}</span>
                    <button>-</button>
                </div>
            </div>
            <button data-id='${item.id}' class='btn__delete__basket'>X</button>
        </div>
            `
        })
        basketTotal.textContent = basket.reduce((acc , rec)=>{
            return acc + rec.price * rec.count
        }, 0)
        basketSale.textContent = basket.reduce((acc , rec)=>{
            return acc + rec.price * rec.count
        }, 0) / 100 * 5

       let btnDeleteBasket = document.querySelectorAll('.btn__delete__basket')
       Array.from(btnDeleteBasket).map((btns)=>{
        btns.addEventListener('click' , ()=>{
            basket = basket.filter((el)=>{
                return el.id !== +btns.dataset.id
            })
            addForBasket()
        })
       }) 
     }
     addForBasket()
})
basketClose.addEventListener('click', ()=>{
    basketProduct.style.display = 'none'
})

// products
let url = 'http://localhost:3000/praducts?'
let products = document.querySelector('.product__cards')
let form = document.querySelector('form')
let seeAll = document.querySelector('.see__al')
let productItem = document.querySelectorAll('.product__item')

let all = ''
let s = 'All'
const getAllProducts = ()=>{
    products.innerHTML = ''
    fetch(url + `${all.length ? '' : "_limit=3&"}${s == 'All' ? '' : 'category='+s}`)
    .then((res)=> res.json())
    .then((res)=> {
        res.map((item=>{
           products.innerHTML += `
              <div class="product__card">
                 <img src="${item.image}" alt="Airpods">
                 <p class="product__card-title">${item.title}</p>
                 <p class="product__card-price">$${item.price}</p>
                 <p class="product__card-price">${item.memory}</p>
                 <p class="product__card-price">category: ${item.category}</p>
                 <button data-id=${item.id} class="product__btn btn__basket">Buy</button>
                 <button data-id=${item.id} class="product__btn btn__change">Change</button>
                 <button data-id=${item.id} class="product__btn btn__delete">Delete</button>
              </div>  
           ` 
        }))
        let btnDelete = document.querySelectorAll('.btn__delete')
        Array.from(btnDelete).map((item)=>{
            item.addEventListener('click' , ()=>{
                fetch('http://localhost:3000/praducts' + `/${item.dataset.id}` , {
                    method:'DELETE'
                }).then((res)=> console.log('успешно'))
                .catch((err)=> alert('Eror'))
            })
        })

        let btnChange = document.querySelectorAll('.btn__change')
        Array.from(btnChange).map((item)=> {
            item.addEventListener('click' , ()=>{
                modalChange()
                fetch('http://localhost:3000/praducts' + `/${item.dataset.id}`)
                .then((res)=> res.json())
                .then((res)=> {
                    form[0].value = res.title
                    form[1].value = res.price
                    form[2].value = res.memory
                    form[3].value = res.image
                    form[4].value = res.category
                }).catch((err)=> alert(err))
            form.addEventListener('submit' , (e)=>{
                // const method = decideRequestMethod()
                fetch('http://localhost:3000/praducts' + `/${item.dataset.id}` , {
                    method:decideRequestMethod(),
                    headers:{
                        'Content-type':"application/json"
                    },
                    body:JSON.stringify(
                        {
                            title:e.target[0].value,
                            image :e.target[3].value,
                            price:e.target[1].value,
                            memory:e.target[2].value,
                            category:e.target[4].value,
                        }
                    )
                }).then((res)=> alert('изменено'))
                .catch((err)=> alert(err))
                function decideRequestMethod(){
                    const resource = 'patch'
                    if (resource){
                        return 'PATCH'
                    }else{
                        return 'POST'
                    }
                }
            })
            })
        })
        let btnBasket = document.querySelectorAll('.btn__basket')
        Array.from(btnBasket).map((item)=>{
            item.addEventListener('click' , ()=>{
                fetch('http://localhost:3000/praducts' + `/${item.dataset.id}`)
                .then((res)=> res.json())
                .then((res)=> {
                    let have = basket.findIndex(item => item.id == res.id)
                    if (have >= 0) {
                        basket[have] = {...basket[have] , count: basket[have].count + 1}
                    }else{
                         basket = [...basket , {
                        ...res,
                        count: 1
                    }]
                    }
                   
                    console.log(basket);
                    basketCount.textContent = basket.length
                }).catch((err)=> alert(err))
            })
        })
    })
    .catch((err)=> alert(err))
}
getAllProducts()

form.addEventListener('submit' , (e)=>{
    e.preventDefault()
    fetch(url , {
        method : decideRequestMethod(),
        headers : {
            "Content-type":"application/json"
        },
        body: JSON.stringify(
            {
                title:e.target[0].value,
                image :e.target[3].value,
                price:e.target[1].value,
                memory:e.target[2].value,
                category:e.target[4].value,
            }
        )
    }).then((res)=> alert('успешно'))
    .catch((err)=> alert(err))
    function decideRequestMethod(){
        const resource = ''
        if (resource){
            return 'PATCH'
        }else{
            return 'POST'
        }
    }
})

seeAll.addEventListener('click' , ()=>{
    if (seeAll.textContent == 'See all>') {
        seeAll.textContent = 'Hide all<'
        all = 'all'
        getAllProducts()
    }else{
        seeAll.textContent = 'See all>'
        all = ''
        getAllProducts()
    }
})

Array.from(productItem).map((item)=>{
    item.addEventListener('click' , ()=>{
        s = item.textContent
        console.log(s);
        getAllProducts()
    })
})