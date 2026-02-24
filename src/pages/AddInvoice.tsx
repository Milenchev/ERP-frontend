import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface Product {
  id: number
  name: string
  unit: string
  quantity: number
  price: number
  discount: number
}

interface Client {
  uid: number
  clientName: string
  mol: string
}

export function AddInvoice() {
  const [invoiceNum, setInvoiceNum] = useState('3000000001')
  const [clientName, setClientName] = useState('')
  const [clientId, setClientId] = useState(0)
  const [owner, setOwner] = useState('')
  const [typeDoc, setTypeDoc] = useState('0')
  const [paymentType, setPaymentType] = useState('0')
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: '', unit: 'бр.', quantity: 0, price: 0, discount: 0 }
  ])

  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDate] = useState(new Date())

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

    GetMaximumInvoiceNum()
    fetchData()
  }, [])

  const handleClick = async () => {
    try {
      const invoiceTotalValue = products
        .reduce(
          (acc, invoice) =>
            acc +
            invoice.quantity * invoice.price * (1 - invoice.discount / 100) +
            invoice.quantity * invoice.price * (1 - invoice.discount / 100) * 0.2,
          0
        )
        .toFixed(2)

      const response = await fetch('http://localhost:5001/addOutgoingInvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice: {
            invoiceNum: invoiceNum,
            client: clientName,
            clientId: clientId,
            ownerName: owner,
            type: typeDoc,
            date: currentDate.toLocaleDateString(),
            typeOfPayment: paymentType,
            total_value: invoiceTotalValue,
            products: products,
          },
        }),
      })

      const result = await response.json()
      console.log(result)
      window.history.go(-1)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleInputChange = (id: number, e: React.ChangeEvent<HTMLInputElement>, index: number, key: keyof Product) => {
    let updatedProducts = products.map((item) =>
      item.id === id ? { ...item, [key]: e.target.value } : item
    )

    if (index === products.length - 1 && e.target.value !== '') {
      updatedProducts = [
        ...updatedProducts,
        {
          id: products.length + 1,
          name: '',
          unit: 'бр.',
          quantity: 0,
          price: 0,
          discount: 0,
        },
      ]
    }

    setProducts(updatedProducts)
  }

  const SetClient = (client_name: string) => {
    setClientName(client_name)
    setSelectedClient(client_name)
    for (let ci = 0; ci < clients.length; ci++) {
      if (clients[ci].clientName === client_name) {
        setClientId(clients[ci].uid)
        setOwner(clients[ci].mol)
        break
      }
    }
  }

  const GetMaximumInvoiceNum = async () => {
    try {
      const response = await fetch(`http://localhost:5001/getLastInvoiceNum?invoice_type=${typeDoc}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      if (data['invoice_num'] === 'none') {
        if (typeDoc === '0') {
          setInvoiceNum('3000000001')
        } else {
          setInvoiceNum('2000000001')
        }
      } else {
        setInvoiceNum(String(parseInt(data['invoice_num']) + 1))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (typeDoc) {
      GetMaximumInvoiceNum()
    }
  }, [typeDoc])

  const subtotal = products.reduce(
    (acc, invoice) => acc + invoice.quantity * invoice.price * (1 - invoice.discount / 100),
    0
  )
  const vat = subtotal * 0.2
  const total = subtotal + vat

  return (
    <div className="add-invoice">
      <div className="add-invoice__container">
        <div className="add-invoice__header">
          <span>Добавяне на изходна фактура ({invoiceNum})</span>
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
                {clients.map((client) => (
                  <option key={client.uid} value={client.clientName}>
                    {client.clientName}
                  </option>
                ))}
              </select>
            </div>

            <div className="add-invoice__field">
              <label>МОЛ</label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </div>

            <div className="add-invoice__field add-invoice__field--small">
              <label>Тип на документа</label>
              <select value={typeDoc} onChange={(e) => setTypeDoc(e.target.value)}>
                <option value="0">Фактура</option>
                <option value="1">Проформа фактура</option>
              </select>
            </div>

            <div className="add-invoice__field add-invoice__field--small">
              <label>Фактура номер</label>
              <input type="text" disabled value={invoiceNum} />
            </div>

            <div className="add-invoice__field add-invoice__field--small">
              <label>Дата на фактура</label>
              <input type="text" disabled value={currentDate.toLocaleDateString()} />
            </div>
          </div>

          <div className="add-invoice__row">
            <div className="add-invoice__field">
              <label>Начин на плащане</label>
              <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
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
                <th style={{ width: '10%' }}>Т.О.(%)</th>
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
                      value={product.name}
                      onChange={(e) => handleInputChange(product.id, e, index, 'name')}
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
                  <td>
                    <input
                      type="number"
                      value={product.discount}
                      onChange={(e) => handleInputChange(product.id, e, index, 'discount')}
                      style={{ width: '60%' }}
                    />
                  </td>
                  <td>{(product.price * product.quantity).toFixed(2)} лв.</td>
                </tr>
              ))}

              <tr className="add-invoice__totals-row">
                <td colSpan={5}></td>
                <td className="add-invoice__totals-label">Субтотал</td>
                <td>{subtotal.toFixed(2)} лв.</td>
              </tr>

              <tr className="add-invoice__totals-row">
                <td colSpan={5}></td>
                <td className="add-invoice__totals-label">ДДС 20%</td>
                <td>{vat.toFixed(2)} лв.</td>
              </tr>

              <tr className="add-invoice__totals-row add-invoice__totals-row--final">
                <td colSpan={5}></td>
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
          <Button variant="secondary" className="add-invoice__btn-print">
            Добавяне и печат
          </Button>
          <Link to="/documents">
            <Button variant="outline" className="add-invoice__btn-back">
              Назад
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
