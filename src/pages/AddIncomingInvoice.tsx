import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function AddIncomingInvoice() {
  const [supplier, setSupplier] = useState('')
  const [faxNum, setFaxNum] = useState('')
  const [invoiceTotalValue, setInvoiceTotalValue] = useState('')
  const [faxDate, setFaxDate] = useState('')
  const [paymentType, setPaymentType] = useState('0')
  const [comment, setComment] = useState('')
  const [currency, setCurrency] = useState('BGN')
  const [fileBase64, setFileBase64] = useState('')
  const [fileName, setFileName] = useState('')

  const handleClick = async () => {
    try {
      const dateSplit = faxDate.split('.')
      const day = parseInt(dateSplit[0])
      const month = parseInt(dateSplit[1]) - 1 // Month is 0-indexed in JavaScript
      const year = parseInt(dateSplit[2])
      
      const expDate = new Date(year, month, day)
      expDate.setDate(expDate.getDate() + 15)
      
      const expDay = expDate.getDate()
      const expMonth = expDate.getMonth() + 1
      const expYear = expDate.getFullYear()
      const expDateFormat = `${expDay}.${expMonth}.${expYear}`

      const response = await fetch('http://localhost:5001/addIncomingInvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice: {
            supplierName: supplier,
            expDate: expDateFormat,
            fax: faxNum,
            date: faxDate,
            typeOfPayment: paymentType,
            total_value: invoiceTotalValue,
            base_64_file: fileBase64,
            comment: comment,
            currency: currency,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64File = (reader.result as string).split(',')[1]
        setFileBase64(base64File)
      }
    }
  }

  return (
    <div className="add-invoice">
      <div className="add-invoice__container">
        <div className="add-invoice__header">
          <span>Добавяне на входна фактура</span>
        </div>

        <div className="add-invoice__form">
          <div className="add-invoice__section">
            <h3 className="add-invoice__section-title">Основна информация</h3>
            <div className="add-invoice__row">
              <div className="add-invoice__field add-invoice__field--large">
                <label>Доставчик</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Име на доставчик"
                />
              </div>

              <div className="add-invoice__field">
                <label>Фактура номер</label>
                <input
                  type="text"
                  value={faxNum}
                  onChange={(e) => setFaxNum(e.target.value)}
                  placeholder="Номер"
                />
              </div>

              <div className="add-invoice__field">
                <label>Дата на фактура</label>
                <input
                  type="text"
                  value={faxDate}
                  onChange={(e) => setFaxDate(e.target.value)}
                  placeholder="дд.мм.гггг"
                />
              </div>

              <div className="add-invoice__field add-invoice__field--large">
                <label>Коментар</label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Допълнителна информация"
                />
              </div>
            </div>
          </div>

          <div className="add-invoice__section">
            <h3 className="add-invoice__section-title">Детайли за плащане</h3>
            <div className="add-invoice__row">
              <div className="add-invoice__field">
                <label>Срок за плащане</label>
                <select disabled>
                  <option>15 дни</option>
                </select>
              </div>

              <div className="add-invoice__field">
                <label>Начин на плащане</label>
                <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                  <option value="0">Банков превод</option>
                  <option value="1">В брой</option>
                  <option value="2">Пощенски паричен</option>
                </select>
              </div>

              <div className="add-invoice__field">
                <label>Сума за плащане (С ДДС)</label>
                <input
                  type="number"
                  value={invoiceTotalValue}
                  onChange={(e) => setInvoiceTotalValue(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="add-invoice__field">
                <label>Валута</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="BGN">Лв.</option>
                  <option value="USD">$</option>
                  <option value="EUR">Евро</option>
                </select>
              </div>
            </div>
          </div>

          <div className="add-invoice__section">
            <h3 className="add-invoice__section-title">Документация</h3>
            <div className="add-invoice__row">
              <div className="add-invoice__field add-invoice__field--file">
                <label>Прикачи PDF файл</label>
                <div className="add-invoice__file-input">
                  <input
                    type="file"
                    accept=".pdf"
                    id="invoiceFile"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="invoiceFile" className="add-invoice__file-label">
                    {fileName || 'Избери файл'}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="add-invoice__footer">
          <Button onClick={handleClick} className="add-invoice__btn-add">
            Добавяне
          </Button>
          <Link to="/expenses">
            <Button variant="outline" className="add-invoice__btn-back">
              Назад
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
