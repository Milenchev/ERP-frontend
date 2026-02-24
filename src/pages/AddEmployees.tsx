import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function AddEmployees() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [salary, setSalary] = useState('')
  const [insurance, setInsurance] = useState('')
  const [tax, setTax] = useState('')
  const [additionalPay, setAdditionalPay] = useState('')

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:5001/addEmployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employees: {
            name: name,
            salary: salary,
            insurance: insurance,
            tax: tax,
            additionalPay: additionalPay,
          },
        }),
      })

      const result = await response.json()
      console.log(result)
      navigate('/employees')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="add-invoice">
      <div className="add-invoice__container">
        <div className="add-invoice__header">
          <span>Добавяне на служител</span>
        </div>

        <div className="add-invoice__form">
          <div className="add-invoice__section">
            <h3 className="add-invoice__section-title">Основна информация</h3>
            <div className="add-invoice__row">
              <div className="add-invoice__field add-invoice__field--large">
                <label>Име</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Име на служител"
                />
              </div>
            </div>

            <div className="add-invoice__row">
              <div className="add-invoice__field">
                <label>Заплата</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="add-invoice__field">
                <label>Осигуровки</label>
                <input
                  type="number"
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="add-invoice__section">
            <h3 className="add-invoice__section-title">Допълнителна информация</h3>
            <div className="add-invoice__row">
              <div className="add-invoice__field">
                <label>Данък</label>
                <input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="add-invoice__field">
                <label>Допълнение</label>
                <input
                  type="number"
                  value={additionalPay}
                  onChange={(e) => setAdditionalPay(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="add-invoice__footer">
          <Button onClick={handleClick} className="add-invoice__btn-add">
            Запис
          </Button>
          <Link to="/employees">
            <Button variant="outline" className="add-invoice__btn-back">
              Отказ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
