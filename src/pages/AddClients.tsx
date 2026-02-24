import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function AddClients() {
  const navigate = useNavigate()
  const [firmName, setFirmName] = useState('')
  const [mol, setMol] = useState('')
  const [eik, setEik] = useState('')
  const [dds, setDds] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [clientType, setClientType] = useState('0')

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:5001/addClients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clients: {
            firmName: firmName,
            clientName: firmName,
            mol: mol,
            eik: eik,
            dds: dds,
            address: address,
            city: city,
            country: country,
            email: email,
            phone: phone,
            clientType: clientType,
          },
        }),
      })

      const result = await response.json()
      console.log(result)
      navigate('/clients')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="add-invoice">
      <div className="add-invoice__container">
        <div className="add-invoice__header">
          <span>Добавяне на клиент</span>
        </div>

        <div className="add-invoice__form">
          <div className="add-invoice__section">
            <h3 className="add-invoice__section-title">Основна информация</h3>
            <div className="add-invoice__row">
              <div className="add-invoice__field">
                <label>Тип клиент</label>
                <select value={clientType} onChange={(e) => setClientType(e.target.value)}>
                  <option value="0">Частно лице</option>
                  <option value="1">Фирма</option>
                </select>
              </div>

              <div className="add-invoice__field add-invoice__field--large">
                <label>Име на фирма / Лице</label>
                <input
                  type="text"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  placeholder="Име"
                />
              </div>
            </div>

            <div className="add-invoice__row">
              <div className="add-invoice__field">
                <label>МОЛ</label>
                <input
                  type="text"
                  value={mol}
                  onChange={(e) => setMol(e.target.value)}
                  placeholder="Материално отговорно лице"
                />
              </div>

              <div className="add-invoice__field">
                <label>ЕИК/ЕГН</label>
                <input
                  type="text"
                  value={eik}
                  onChange={(e) => setEik(e.target.value)}
                  placeholder="ЕИК/ЕГН"
                />
              </div>

              <div className="add-invoice__field">
                <label>Идент. №. ДДС</label>
                <input
                  type="text"
                  value={dds}
                  onChange={(e) => setDds(e.target.value)}
                  placeholder="BG000000000"
                />
              </div>
            </div>
          </div>

          <div className="add-invoice__section">
            <h3 className="add-invoice__section-title">Местоположение</h3>
            <div className="add-invoice__row">
              <div className="add-invoice__field add-invoice__field--large">
                <label>Адрес</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Адрес"
                />
              </div>

              <div className="add-invoice__field">
                <label>Град</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Град"
                />
              </div>

              <div className="add-invoice__field">
                <label>Държава</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Държава"
                />
              </div>
            </div>
          </div>

          <div className="add-invoice__section">
            <h3 className="add-invoice__section-title">Допълнителна информация</h3>
            <div className="add-invoice__row">
              <div className="add-invoice__field">
                <label>Имейл</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div className="add-invoice__field">
                <label>Телефон</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+359"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="add-invoice__footer">
          <Button onClick={handleClick} className="add-invoice__btn-add">
            Запис
          </Button>
          <Link to="/clients">
            <Button variant="outline" className="add-invoice__btn-back">
              Отказ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
