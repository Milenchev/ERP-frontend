import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

interface Product {
  uid: string
  name: string
  quantity: number
  price: number
  discount: number
}

interface InvoiceInfo {
  type: number
  client: string
  date: string
  typeOfPayment: number
  uid: string
}

export function ViewInvoice() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [responseProducts, setResponseProducts] = useState<Product[]>([])
  const invoiceId = searchParams.get('invoice_id')
  const [invoiceInfo, setInvoiceInfo] = useState<InvoiceInfo>({
    type: 0,
    client: '',
    date: '',
    typeOfPayment: 0,
    uid: ''
  })
  const [totalValue, setTotalValue] = useState(0)

  const paddedInvoiceId = invoiceId ? invoiceId.padStart(10, '0') : ''

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/getDashboardInvoices')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        
        // Find invoice by UID - compare as strings
        const invoice = data.outgoing.find((inv: InvoiceInfo) => String(inv.uid) === String(invoiceId))
        
        if (invoice) {
          setInvoiceInfo(invoice)
          
          const responseProducts = await fetch(
            `http://localhost:5001/getProductbyInvoice_id?invoice_id=${invoice.uid}`
          )
          
          if (responseProducts.ok) {
            const dataProducts = await responseProducts.json()
            let totalVal = 0
            
            for (let di = 0; di < dataProducts.product.length; di++) {
              const price = typeof dataProducts.product[di].price === 'string' 
                ? parseFloat(dataProducts.product[di].price) 
                : dataProducts.product[di].price
              const quantity = typeof dataProducts.product[di].quantity === 'string'
                ? parseFloat(dataProducts.product[di].quantity)
                : dataProducts.product[di].quantity
              totalVal += quantity * price
            }
            
            setTotalValue(totalVal)
            setResponseProducts(dataProducts.product)
            
            // Auto-print after data loads
            setTimeout(() => {
              // Set up event listener to navigate after print dialog closes
              const handleAfterPrint = () => {
                navigate('/documents')
                window.removeEventListener('afterprint', handleAfterPrint)
              }
              
              window.addEventListener('afterprint', handleAfterPrint)
              window.print()
            }, 500)
          }
        } else {
          setError('Invoice not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [invoiceId, navigate])

  if (loading) {
    return <div className="view-invoice__loading">Loading...</div>
  }

  if (error) {
    return <div className="view-invoice__error">Error: {error}</div>
  }

  return (
    <div className="view-invoice">
      <div className="view-invoice__header">
        <div className="view-invoice__title">
          {invoiceInfo.type === 0 ? (
            <span>Фактура</span>
          ) : invoiceInfo.type === 1 ? (
            <span>Проформа фактура <span className="view-invoice__original">Оригинал</span></span>
          ) : (
            <span>Unknown Status</span>
          )}
        </div>
        <div className="view-invoice__logo"></div>
      </div>

      <div className="view-invoice__row-holder">
        <div className="view-invoice__content-row">
          <div className="view-invoice__content-header">
            <span>Доставчик/изпълнител</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Име:</span>
            <span className="view-invoice__value">Axeron Solutions</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Държава:</span>
            <span className="view-invoice__value">България</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Гр./с.:</span>
            <span className="view-invoice__value">Пловдив</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Адрес:</span>
            <span className="view-invoice__value">ж.к "Тракия" бл. 193, вх.в, ет.2, офис 4</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Идент №.:ДДС:</span>
            <span className="view-invoice__value">BG57575757</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">ЕИК/ЕГН:</span>
            <span className="view-invoice__value">0191919991</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">МОЛ:</span>
            <span className="view-invoice__value">Тодор Тодоров</span>
          </div>
        </div>

        <div className="view-invoice__content-row">
          <div className="view-invoice__content-header">
            <span>Получател/възложител</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Име:</span>
            <span className="view-invoice__value">{invoiceInfo.client}</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Държава:</span>
            <span className="view-invoice__value">България</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Гр./с.:</span>
            <span className="view-invoice__value">Пловдив</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Адрес:</span>
            <span className="view-invoice__value">ул."Йордан Гавазов" № 1</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Идент №.:ДДС:</span>
            <span className="view-invoice__value">BG57575757</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">ЕИК/ЕГН:</span>
            <span className="view-invoice__value">0191919991</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">МОЛ:</span>
            <span className="view-invoice__value">Тодор Тодоров</span>
          </div>
        </div>
      </div>

      <div className="view-invoice__row-holder">
        <div className="view-invoice__content-row">
          <div className="view-invoice__content-header">
            <span>Информация за фактурата</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Фактура №:</span>
            <span className="view-invoice__value">{paddedInvoiceId}</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Дата на фактурата:</span>
            <span className="view-invoice__value">{invoiceInfo.date}</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Срок за плащане:</span>
            <span className="view-invoice__value">08.02.2025</span>
          </div>
        </div>

        <div className="view-invoice__content-row">
          <div className="view-invoice__content-header">
            <span>Информация за плащането</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Валута:</span>
            <span className="view-invoice__value">BGN</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Начин на плащане:</span>
            <span className="view-invoice__value">
              {invoiceInfo.typeOfPayment === 0
                ? 'Банков път'
                : invoiceInfo.typeOfPayment === 1
                ? 'В брой'
                : invoiceInfo.typeOfPayment === 2
                ? 'Пощенски паричен'
                : 'Unknown'}
            </span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">Банка:</span>
            <span className="view-invoice__value">ОББ-Клон Пловдив</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">BIC:</span>
            <span className="view-invoice__value">UBBSBBSS</span>
          </div>

          <div className="view-invoice__info-row">
            <span className="view-invoice__label">IBAN:</span>
            <span className="view-invoice__value">BG1919292198128128</span>
          </div>
        </div>
      </div>

      <table className="view-invoice__table">
        <thead>
          <tr>
            <th style={{ width: '3%' }}>#</th>
            <th style={{ width: '30%' }}>Описание на стока/услуга</th>
            <th style={{ width: '10%' }}>Мярка</th>
            <th style={{ width: '10%' }}>К-во</th>
            <th style={{ width: '10%' }}>Ед. цена</th>
            <th style={{ width: '10%' }}>Т.О.(%)</th>
            <th style={{ width: '10%' }}>Стойност</th>
          </tr>
        </thead>
        <tbody>
          {responseProducts.map((product, index) => {
            const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
            const quantity = typeof product.quantity === 'string' ? parseFloat(product.quantity) : product.quantity
            return (
              <tr key={product.uid}>
                <td>{index + 1}</td>
                <td className="view-invoice__product-name">{product.name}</td>
                <td>бр.</td>
                <td>{quantity}</td>
                <td>{price.toFixed(2)} лв.</td>
                <td>{product.discount}%</td>
                <td>{(quantity * price).toFixed(2)} лв.</td>
              </tr>
            )
          })}

          <tr className="view-invoice__total-row">
            <td colSpan={4} className="view-invoice__total-label">
              Словом: две хиляди и четиридесет лева
            </td>
            <td colSpan={2} className="view-invoice__total-text">Сума</td>
            <td>{totalValue.toFixed(2)} лв.</td>
          </tr>

          <tr className="view-invoice__total-row">
            <td colSpan={4}></td>
            <td colSpan={2} className="view-invoice__total-text">Данъчна основа</td>
            <td>{totalValue.toFixed(2)} лв.</td>
          </tr>

          <tr className="view-invoice__total-row">
            <td colSpan={4}></td>
            <td colSpan={2} className="view-invoice__total-text">ДДС 20.00%</td>
            <td>{(totalValue * 0.2).toFixed(2)} лв.</td>
          </tr>

          <tr className="view-invoice__total-row view-invoice__total-row--final">
            <td colSpan={4}></td>
            <td colSpan={2} className="view-invoice__total-text">Общо с ДДС</td>
            <td>{(totalValue + totalValue * 0.2).toFixed(2)} лв.</td>
          </tr>
        </tbody>
      </table>

      <footer className="view-invoice__footer">
        <div className="view-invoice__footer-item">
          <span>Получател: {invoiceInfo.client}</span>
        </div>
        <div className="view-invoice__footer-item">
          <span>Съставил: Тодор Тодоров</span>
        </div>
        <div className="view-invoice__footer-item">
          <span>Шифър: C2000</span>
        </div>
      </footer>
    </div>
  )
}
