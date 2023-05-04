import React, { FC, useCallback, useState } from 'react';
import { AiOutlineSearch, AiFillCloseCircle } from 'react-icons/ai';
import { Input, Skeleton, Divider, Text } from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { searchLocationByText } from '../../services/apiRequests/map';

import './styles.css';

type Props = {
  onSelectLocation: (location: { lat: number; lng: number }) => void;
  style: object;
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 10,
    top: 10,
    right:400,
    background: '#fff',
    height: 40,
    padding: '0px 10px',
    borderRadius: 8,
    boxShadow: 'rgb(0 0 0 / 30%) 0px 1px 4px -1px',
    fontSize: 18,
    color: '#565656',
  },
  input: {
    width: 300,
  },
  resultContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    borderRadius: 8,
    background: '#fff',
    boxShadow: 'rgb(0 0 0 / 30%) 0px 1px 4px -1px',
    maxHeight: 300,
    overflowY: 'auto',
  },
  locationItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 16px',
    cursor: 'pointer',
  },
};

export const MapSearchbar: FC<Props> = ({ onSelectLocation, style }) => {
  const [searchKey, setSearchKey] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [locations, setLocations] = useState<Array<Object>>([]);

  const handleSearchLocation = useCallback(
    debounce(async (keyword) => {
      setIsSearching(true);

      if (keyword) {
        const result = await searchLocationByText(keyword);
        setLocations(result);
      }

      setIsSearching(false);
    }, 500),
    []
  );

  const handleSelectLocation = useCallback(({ lat, lng }) => {
    setSearchKey('');
    setLocations([]);

    onSelectLocation && onSelectLocation({ lat, lng });
  }, []);

  return (
    <div style={{ ...styles.container, ...style }}>
      <AiOutlineSearch size={25} color='#565656' />
      <Input
        style={styles.input}
        placeholder='場所を検索'
        border='none'
        focusBorderColor='transparent'
        value={searchKey}
        onChange={(event) => {
          setSearchKey(event.target.value);
          setIsSearching(true);
          handleSearchLocation(event.target.value);
        }}
      />
      <AiFillCloseCircle
        onClick={() => setSearchKey('')}
        size={20}
        color='#dcdcdc'
      />

      {!!searchKey && (
        <div style={styles.resultContainer}>
          {isSearching ? (
            <div style={{ padding: 16 }}>
              <Skeleton
                style={{ marginBottom: 8 }}
                startColor='#f3f3f3'
                endColor='#dcdcdc'
                height='40px'
              />
              <Skeleton
                style={{ marginBottom: 8 }}
                startColor='#f3f3f3'
                endColor='#dcdcdc'
                height='40px'
              />
              <Skeleton startColor='#f3f3f3' endColor='#dcdcdc' height='40px' />
            </div>
          ) : (
            <>
              {locations.map((location: any, index) => {
                const { geometry } = location;

                return (
                  <React.Fragment key={index}>
                    <div
                      onClick={() => handleSelectLocation(geometry.location)}
                      className='map-search-bar-item-container'
                      style={styles.locationItemContainer}
                    >
                      <Text
                        textAlign='left'
                        fontSize='sm'
                        color='#565656'
                        fontWeight='bold'
                      >
                        {location.name}
                      </Text>
                      <Text
                        textAlign='left'
                        fontSize='xs'
                        color='#dcdcdc'
                        fontWeight='bold'
                      >
                        {location.formatted_address}
                      </Text>
                    </div>
                    {index !== locations.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};
