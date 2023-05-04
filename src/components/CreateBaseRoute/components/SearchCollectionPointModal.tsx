import {
  Modal,
  Input,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

export const SearchCollectionPointModal = ({
  isVisible,
  setVisible,
  cps,
  onSelectCp,
}) => {
  const [keyword, setKeyword] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    if (!isVisible) {
      setSearchResult([]);
      setKeyword('');
    }
  }, [isVisible]);

  return (
    <Modal isOpen={isVisible} onClose={() => setVisible(false)} size='xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mb={3}>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody style={{ marginBottom: 16, position: 'relative' }}>
          <Input
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);

              if (!e.target.value) {
                setSearchResult([]);
                return;
              }

              const newCps = cps.filter(
                (cp) =>
                  cp.name.includes(e.target.value) ||
                  cp.sequence.toString().includes(e.target.value)
              );

              setSearchResult(newCps);
            }}
          />
          {!!searchResult.length && (
            <div
              style={{
                zIndex: 100,
                position: 'absolute',
                width: 'calc(100% - 48px)',
                background: '#fff',
                left: 24,
                right: 24,
                padding: 16,
                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                marginTop: 10,
                borderRadius: 4,
                maxHeight: 400,
                overflowY: 'auto',
              }}
            >
              {searchResult.map((cp, index) => {
                return (
                  <div
                    onClick={() => onSelectCp(cp)}
                    className='searchCps_item'
                    style={{
                      borderBottom: '1px solid #f3f3f3',
                      padding: '8px 0',
                      cursor: 'pointer',
                    }}
                  >
                    {cp.sequence}. <b>{cp.name}</b>
                  </div>
                );
              })}
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
