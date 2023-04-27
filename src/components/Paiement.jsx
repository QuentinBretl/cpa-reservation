
import { useState } from 'react';
import React from 'react'

function Paiement() {
    const [selectedOption, setSelectedOption] = useState("Non reglé");

    function handleOptionChange(event) {
      setSelectedOption(event.target.value);
    }
  
    return (
      <div>
        <label>
          <select value={selectedOption} onChange={handleOptionChange}>
            <option value="optionDef">Non reglé</option>
            <option value="option1">C.B</option>
            <option value="option2">Chèque</option>
            <option value="option3">Espèces</option>
            <option value="option3">Ch. Vac.</option>
            <option value="option3">Bon Cad.</option>
          </select>
        </label>
      </div>
    );
  }

export default Paiement