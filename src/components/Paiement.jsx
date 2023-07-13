import React, { useState } from 'react';

function Paiement({ reglement, handleOptionChange }) {
  const [selectedOptions, setSelectedOptions] = useState(reglement || []);

  const handleCheckboxChange = (event) => {
    const option = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      setSelectedOptions(selectedOptions.filter((value) => value !== option));
    }
  };

  // Appeler la fonction handleOptionChange du parent chaque fois que les options changent
  // en passant les options sélectionnées en tant qu'argument
  React.useEffect(() => {
    handleOptionChange(selectedOptions);
  }, [selectedOptions, handleOptionChange]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          value="option1"
          checked={selectedOptions.includes('option1')}
          onChange={handleCheckboxChange}
        />
        C.B
      </label>
      <label>
        <input
          type="checkbox"
          value="option2"
          checked={selectedOptions.includes('option2')}
          onChange={handleCheckboxChange}
        />
        Chèque
      </label>
      <label>
        <input
          type="checkbox"
          value="option3"
          checked={selectedOptions.includes('option3')}
          onChange={handleCheckboxChange}
        />
        Espèces
      </label>
      <label>
        <input
          type="checkbox"
          value="option4"
          checked={selectedOptions.includes('option4')}
          onChange={handleCheckboxChange}
        />
        Ch. Vac.
      </label>
      <label>
        <input
          type="checkbox"
          value="option5"
          checked={selectedOptions.includes('option5')}
          onChange={handleCheckboxChange}
        />
        Bon Cad.
      </label>
    </>
  );
}

export default Paiement;