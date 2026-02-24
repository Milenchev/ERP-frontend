import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface Product {
  offerId: number
  productName: string
  unit: string
  quantity: number
  price: number
}

export function AddOffer() {
  const navigate = useNavigate()
  const [clientName, setClientName] = useState('')
  const [mol, setMol] = useState('')
  const [typeOfOffer, setTypeOfOffer] = useState('0')
  const [dateOfOffer, setDateOfOffer] = useState('')
  const [heading, setHeading] = useState('')
  const [products, setProducts] = useState<Product[]>([
    { offerId: 0, productName: '', unit: 'бр.', quantity: 0, price: 0 }
  ])
  const [showContentA, setShowContentA] = useState(true)

  const addOffer = async () => {
    const totalPrice = products.reduce(
      (acc, p) => acc + p.quantity * p.price + p.quantity * p.price * 0.2,
      0
    )

    try {
      const response = await fetch('http://localhost:5001/addOffers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offer: {
            clientName: clientName,
            mol: mol,
            typeOfOffer: typeOfOffer,
            dateOfOffer: dateOfOffer,
            heading: heading,
            price: totalPrice,
            state: 0,
            products: products,
          },
        }),
      })

      const result = await response.json()
      console.log(result)
      navigate('/offers')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleInputChange = (id: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number, key: keyof Product) => {
    let updatedProducts = products.map((item) =>
      item.offerId === id ? { ...item, [key]: e.target.value } : item
    )

    if (index === products.length - 1 && e.target.value !== '') {
      updatedProducts = [
        ...updatedProducts,
        {
          offerId: products.length + 1,
          productName: '',
          unit: 'бр.',
          quantity: 0,
          price: 0,
        },
      ]
    }

    setProducts(updatedProducts)
  }

  const subtotal = products.reduce((acc, p) => acc + p.quantity * p.price, 0)
  const vat = subtotal * 0.2
  const total = subtotal + vat

  return (
    <div className="add-invoice">
      <div className="add-invoice__container">
        <div className="add-invoice__header">
          <span>Добавяне на оферта</span>
        </div>

        <div className="add-invoice__tabs">
          <button
            className={`add-invoice__tab ${showContentA ? 'add-invoice__tab--active' : ''}`}
            onClick={() => setShowContentA(true)}
          >
            Основна информация
          </button>
          <button
            className={`add-invoice__tab ${!showContentA ? 'add-invoice__tab--active' : ''}`}
            onClick={() => setShowContentA(false)}
          >
            Артикули
          </button>
        </div>

        {showContentA ? (
          <div className="add-invoice__form">
            <div className="add-invoice__row">
              <div className="add-invoice__field">
                <label>Клиент</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Име на клиент"
                />
              </div>

              <div className="add-invoice__field">
                <label>МОЛ</label>
                <input
                  type="text"
                  value={mol}
                  onChange={(e) => setMol(e.target.value)}
                />
              </div>

              <div className="add-invoice__field">
                <label>Тип на оферта</label>
                <select value={typeOfOffer} onChange={(e) => setTypeOfOffer(e.target.value)}>
                  <option value="0">Проект</option>
                  <option value="1">Обект</option>
                </select>
              </div>
            </div>

            <div className="add-invoice__row">
              <div className="add-invoice__field">
                <label>Дата на оферта</label>
                <input
                  type="text"
                  value={dateOfOffer}
                  onChange={(e) => setDateOfOffer(e.target.value)}
                  placeholder="дд.мм.гггг"
                />
              </div>

              <div className="add-invoice__field add-invoice__field--large">
                <label>Заглавие</label>
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="Заглавие на офертата"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="add-invoice__table-container">
            <table className="add-invoice__table">
              <thead>
                <tr>
                  <th style={{ width: '3%' }}>№</th>
                  <th style={{ width: '50%' }}>Описание на стока/услуга</th>
                  <th style={{ width: '10%' }}>Мярка</th>
                  <th style={{ width: '10%' }}>К-во</th>
                  <th style={{ width: '10%' }}>Ед. цена</th>
                  <th style={{ width: '10%' }}>Стойност</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.offerId}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={product.productName}
                        onChange={(e) => handleInputChange(product.offerId, e, index, 'productName')}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={product.unit}
                        onChange={(e) => handleInputChange(product.offerId, e, index, 'unit')}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleInputChange(product.offerId, e, index, 'quantity')}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={product.price}
                        onChange={(e) => handleInputChange(product.offerId, e, index, 'price')}
                      />
                    </td>
                    <td>{(product.quantity * product.price).toFixed(2)} лв.</td>
                  </tr>
                ))}

                <tr className="add-invoice__totals-row">
                  <td colSpan={4}></td>
                  <td className="add-invoice__totals-label">Субтотал</td>
                  <td>{subtotal.toFixed(2)} лв.</td>
                </tr>

                <tr className="add-invoice__totals-row">
                  <td colSpan={4}></td>
                  <td className="add-invoice__totals-label">ДДС 20%</td>
                  <td>{vat.toFixed(2)} лв.</td>
                </tr>

                <tr className="add-invoice__totals-row add-invoice__totals-row--final">
                  <td colSpan={4}></td>
                  <td className="add-invoice__totals-label">Общо с ДДС</td>
                  <td>{total.toFixed(2)} лв.</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="add-invoice__footer">
          <Button onClick={addOffer} className="add-invoice__btn-add">
            Добавяне
          </Button>
          <Link to="/offers">
            <Button variant="outline" className="add-invoice__btn-back">
              Назад
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
