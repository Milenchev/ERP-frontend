import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface Product {
  id: number
  productName: string
  unit: string
  quantity: number
  price: number
}

interface Client {
  uid: number
  clientName: string
  mol: string
}

export function AutoInvoiceAdd() {
  const navigate = useNavigate()
  const [client, setClient] = useState('')
  const [clientId, setClientId] = useState(0)
  const [mol, setMol] = useState('')
  const [dateOfMonth, setDateOfMonth] = useState('0')
  const [expDate, setExpDate] = useState('0')
  const [typeOfPayment, setTypeOfPayment] = useState('0')
  const [products, setProducts] = useState<Product[]>([
    { id: 1, productName: '', unit: 'бр.', quantity: 0, price: 0 }
  ])

  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/clients')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        setClients(data.clients)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleClick = async () => {
    const totalPrice = products.reduce(
      (acc, p) => acc + p.quantity * p.price,
      0
    )

    try {
      const response = await fetch('http://localhost:5001/addAutomaticInvoicesProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          automaticInvoice: {
            client: client,
            clientId: clientId,
            dateOfMonth: dateOfMonth,
            price: totalPrice,
            typeOfPayment: typeOfPayment,
            unpaid: 0,
            products: products,
          },
        }),
      })

      const result = await response.json()
      console.log(result)
      navigate('/auto-invoice')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleInputChange = (id: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number, key: keyof Product) => {
    let updatedProducts = products.map((item) =>
      item.id === id ? { ...item, [key]: e.target.value } : item
    )

    if (index === products.length - 1 && e.target.value !== '') {
      updatedProducts = [
        ...updatedProducts,
        {
          id: products.length + 1,
          productName: '',
          unit: 'бр.',
          quantity: 0,
          price: 0,
        },
      ]
    }

    setProducts(updatedProducts)
  }

  const SetClient = (clientName: string) => {
    setClient(clientName)
    setSelectedClient(clientName)
    for (let ci = 0; ci < clients.length; ci++) {
      if (clients[ci].clientName === clientName) {
        setClientId(clients[ci].uid)
        setMol(clients[ci].mol)
        break
      }
    }
  }

  const subtotal = products.reduce((acc, p) => acc + p.quantity * p.price, 0)
  const vat = subtotal * 0.2
  const total = subtotal + vat

  if (loading) {
    return (
      <div className="documents__loading">
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="documents__error">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="add-invoice">
      <div className="add-invoice__container">
        <div className="add-invoice__header">
          <span>Добавяне на автоматична фактура</span>
        </div>

        <div className="add-invoice__form">
          <div className="add-invoice__row">
            <div className="add-invoice__field">
              <label>Клиент</label>
              <select
                value={selectedClient}
                onChange={(e) => SetClient(e.target.value)}
              >
                <option value="">Изберете клиент</option>
                {clients.map((c) => (
                  <option key={c.uid} value={c.clientName}>
                    {c.clientName}
                  </option>
                ))}
              </select>
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
              <label>Месечна дата на автоматизация</label>
              <select value={dateOfMonth} onChange={(e) => setDateOfMonth(e.target.value)}>
                <option value="0">1-ви</option>
                <option value="1">2-ри</option>
                <option value="2">3-ри</option>
                <option value="3">10-ти</option>
                <option value="4">15-ти</option>
              </select>
            </div>
          </div>

          <div className="add-invoice__row">
            <div className="add-invoice__field">
              <label>Срок на плащане</label>
              <select value={expDate} onChange={(e) => setExpDate(e.target.value)}>
                <option value="0">5 дни</option>
                <option value="1">10 дни</option>
                <option value="2">15 дни</option>
              </select>
            </div>

            <div className="add-invoice__field">
              <label>Начин на плащане</label>
              <select value={typeOfPayment} onChange={(e) => setTypeOfPayment(e.target.value)}>
                <option value="0">Банков превод</option>
                <option value="1">В брой</option>
                <option value="2">Пощенски паричен</option>
              </select>
            </div>
          </div>
        </div>

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
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <input
                      type="text"
                      value={product.productName}
                      onChange={(e) => handleInputChange(product.id, e, index, 'productName')}
                    />
                  </td>
                  <td>
                    <select>
                      <option value="бр.">{product.unit}</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleInputChange(product.id, e, index, 'quantity')}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => handleInputChange(product.id, e, index, 'price')}
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

        <div className="add-invoice__footer">
          <Button onClick={handleClick} className="add-invoice__btn-add">
            Добавяне
          </Button>
          <Link to="/auto-invoice">
            <Button variant="outline" className="add-invoice__btn-back">
              Назад
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
