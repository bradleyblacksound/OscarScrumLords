import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'; // manages search box
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox'; // displays search results
import '../styles/comboboxStyles.css';
/**
 * Combobox DOCS: https://reach.tech/combobox/
 */

// styles for combobox
const Searched = styled.div`
  position: absolute;
  top: 16.5rem;
  left: 50rem;
  transform: translateX(-100%);
  color: black;
  width: 100%;
  max-width: 215px;
  background: whitesmoke;
  z-index: 10;

  div {
  font-size: 1rem;
  font-weight: bold;
  color: #6d6875;
  font-family: 'Ubuntu', sans-serif;
  width: 100%;
  }

`;


const Search = ({ panTo }) => {
  const { //                            values deconstructed from usePlacesAutoComplete hook
    ready, //                           is it ready. are all scripts loaded...
    value, //                           current value being typed into search box
    suggestions: {status, data}, //     suggestions coming back from api
    setValue, //                        function to set value
    clearSuggestions, //                function that clears out suggestions
  } = usePlacesAutocomplete({ //        use places Autocomplete options , set to 50km around nola
    requestOptions: {
      location: { lat: () => 29.951065, lng: () => -90.071533 },
      radius: 50 * 1000, //             50km radias around nola
    }
  });

  /**
   * combobox component, onSelect recieves address that user has selected
   */
  return (
    <Searched>
      <Combobox
        onSelect={async (address) => {
          setValue(address, false); // update state with value that user has choosen, fetch data = false because we get that value from the hook and we dont need to query the api for it
          clearSuggestions();
          try { //                                                    take address and pass it to get geocode. cordinates of place being searched for
            const results = await getGeocode({ address }); //         get results from geocode function (coordinants)
            const {lat, lng} = await getLatLng(results[0]); //        async function wrapped in try/catch  gives us back lat and lng of search result

            panTo({ lat, lng });

          } catch (error) {
            console.warn('error!');
          }
        }}
      >
        <ComboboxInput
          value={value} //                                            value comes from useplacesautocomplete hook
          onChange={(e) => { //                                       call set value function, pass in value that is currently inside event
            setValue(e.target.value);
          }}
          disabled={!ready} //                                        disable if useplaces hook isnt ready
          placeholder='❤️❤❤❤️❤️🚲🚲🚲❤️❤❤️❤️'
        />
        <div>
          <ComboboxPopover portal={false}>
            <ComboboxList>
              {status === 'OK' &&
          data.map(({description}) =>(
            <ComboboxOption key={Math.random()} value={description}
            />
          ))}
            </ComboboxList>
          </ComboboxPopover>
        </div>
      </Combobox>
    </ Searched>
  );
};

// popover gives us the suggestions if status is ok map over suggestions
// deconstruct an id and descripton. render an option and give it a key and value
// adding this so i can push

Search.propTypes = {
  panTo: PropTypes.func
};

export default Search;

