import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface StorageItem {
  uid: string
  itemNum: string
  itemName: string
}

interface OrderItem {
  id: number
  productName: string
  unit: string
  quantity: number
  price: number
  productOrderId?: number
}

export function AddOrder() {
  const navigate = useNavigate()
  const [client, setClient] = useState('')
  const [dateApplied, setDateApplied] = useState('')
  const [itemAdded, setItemAdded] = useState<OrderItem[]>([
    { id: 1, productName: '', unit: 'бр.', quantity: 0, price: 0 }
  ])
  const [items, setItems] = useState<StorageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/getAllStorageItems')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        setItems(data.storageItems)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:5001/addOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orders: {
            client: client,
            dateApplied: dateApplied,
            orderItems: itemAdded,
          },
        }),
      })

      const result = await response.json()
      console.log(result)
      navigate('/orders')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleInputChange = (id: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number, key: keyof OrderItem) => {
    let updatedItems = itemAdded.map((item) =>
      item.id === id ? { ...item, [key]: e.target.value } : item
    )

    if (index === itemAdded.length - 1 && e.target.value !== '') {
      updatedItems = [
        ...updatedItems,
        {
          id: itemAdded.length + 1,
          productName: '',
          unit: 'бр.',
          quantity: 0,
          price: 0,
          productOrderId: 0,
        },
      ]
    }

    setItemAdded(updatedItems)
  }

  const filterStorageItems = items

  const subtotal = itemAdded.reduce((acc, item) => acc + item.quantity * item.price, 0)
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
          <span>Добавяне на поръчка</span>
        </div>

        <div className="add-invoice__form">
          <div className="add-invoice__row">
            <div className="add-invoice__field add-invoice__field--large">
              <label>Клиент</label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Име на клиент"
              />
            </div>

            <div className="add-invoice__field">
              <label>Дата на поръчка</label>
              <input
                type="date"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
              />
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
              {itemAdded.map((item, index) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <select
                      value={item.productName}
                      onChange={(e) => handleInputChange(item.id, e, index, 'productName')}
                    >
                      <option value="">Изберете продукт</option>
                      {filterStorageItems.map((storageItem) => (
                        <option key={storageItem.uid} value={storageItem.uid}>
                          {storageItem.itemName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select>
                      <option value="бр.">{item.unit}</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(item.id, e, index, 'quantity')}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleInputChange(item.id, e, index, 'price')}
                    />
                  </td>
                  <td>{(item.quantity * item.price).toFixed(2)} лв.</td>
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
          <Link to="/orders">
            <Button variant="outline" className="add-invoice__btn-back">
              Назад
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
