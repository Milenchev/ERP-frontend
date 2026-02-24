import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Save, Building2, User, CreditCard, Globe } from 'lucide-react'

export function Settings() {
  const [companyName, setCompanyName] = useState('Axeron Solutions')
  const [companyEik, setCompanyEik] = useState('')
  const [companyDds, setCompanyDds] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [companyCity, setCompanyCity] = useState('')
  const [companyCountry, setCompanyCountry] = useState('България')
  const [companyMol, setCompanyMol] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankIban, setBankIban] = useState('')
  const [bankBic, setBankBic] = useState('')
  const [currency, setCurrency] = useState('BGN')
  const [language, setLanguage] = useState('bg')

  const handleSave = () => {
    // Save to localStorage for now
    const settings = {
      companyName, companyEik, companyDds, companyAddress, companyCity,
      companyCountry, companyMol, companyPhone, companyEmail,
      bankName, bankIban, bankBic, currency, language,
    }
    localStorage.setItem('erp_settings', JSON.stringify(settings))
    alert('Настройките са запазени успешно!')
  }

  return (
    <div className="settings">
      <div className="settings__container">
        <div className="settings__header">
          <h1 className="settings__title">Настройки</h1>
          <p className="settings__subtitle">Управление на фирмени данни и предпочитания</p>
        </div>

        <div className="settings__content">
          {/* Company Info */}
          <div className="settings__section">
            <div className="settings__section-header">
              <Building2 size={20} />
              <h2>Фирмена информация</h2>
            </div>
            <div className="settings__grid">
              <div className="settings__field settings__field--large">
                <label>Име на фирма</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Axeron Solutions"
                />
              </div>
              <div className="settings__field">
                <label>ЕИК</label>
                <input
                  type="text"
                  value={companyEik}
                  onChange={(e) => setCompanyEik(e.target.value)}
                  placeholder="000000000"
                />
              </div>
              <div className="settings__field">
                <label>Идент. №. по ДДС</label>
                <input
                  type="text"
                  value={companyDds}
                  onChange={(e) => setCompanyDds(e.target.value)}
                  placeholder="BG000000000"
                />
              </div>
              <div className="settings__field settings__field--large">
                <label>Адрес</label>
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Адрес на фирмата"
                />
              </div>
              <div className="settings__field">
                <label>Град</label>
                <input
                  type="text"
                  value={companyCity}
                  onChange={(e) => setCompanyCity(e.target.value)}
                  placeholder="Град"
                />
              </div>
              <div className="settings__field">
                <label>Държава</label>
                <input
                  type="text"
                  value={companyCountry}
                  onChange={(e) => setCompanyCountry(e.target.value)}
                  placeholder="Държава"
                />
              </div>
            </div>
          </div>

          {/* Contact Person */}
          <div className="settings__section">
            <div className="settings__section-header">
              <User size={20} />
              <h2>Лице за контакт</h2>
            </div>
            <div className="settings__grid">
              <div className="settings__field">
                <label>МОЛ</label>
                <input
                  type="text"
                  value={companyMol}
                  onChange={(e) => setCompanyMol(e.target.value)}
                  placeholder="Материално отговорно лице"
                />
              </div>
              <div className="settings__field">
                <label>Телефон</label>
                <input
                  type="text"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  placeholder="+359"
                />
              </div>
              <div className="settings__field">
                <label>Имейл</label>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="email@company.com"
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="settings__section">
            <div className="settings__section-header">
              <CreditCard size={20} />
              <h2>Банкови данни</h2>
            </div>
            <div className="settings__grid">
              <div className="settings__field">
                <label>Банка</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Име на банка"
                />
              </div>
              <div className="settings__field">
                <label>IBAN</label>
                <input
                  type="text"
                  value={bankIban}
                  onChange={(e) => setBankIban(e.target.value)}
                  placeholder="BG00XXXX00000000000000"
                />
              </div>
              <div className="settings__field">
                <label>BIC</label>
                <input
                  type="text"
                  value={bankBic}
                  onChange={(e) => setBankBic(e.target.value)}
                  placeholder="XXXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="settings__section">
            <div className="settings__section-header">
              <Globe size={20} />
              <h2>Предпочитания</h2>
            </div>
            <div className="settings__grid">
              <div className="settings__field">
                <label>Валута по подразбиране</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="BGN">Лв. (BGN)</option>
                  <option value="EUR">Евро (EUR)</option>
                  <option value="USD">Долар (USD)</option>
                </select>
              </div>
              <div className="settings__field">
                <label>Език</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="bg">Български</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="settings__footer">
          <Button onClick={handleSave} className="settings__btn-save">
            <Save size={16} />
            Запази настройките
          </Button>
        </div>
      </div>
    </div>
  )
}
