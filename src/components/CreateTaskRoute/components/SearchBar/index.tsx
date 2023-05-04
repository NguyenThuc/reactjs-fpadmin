import { MapSearchbar } from '../../../MapSearchBar';


export const CustomSearchBar = (props) => {
  return (
    <MapSearchbar
      style={{
        position: 'static'
      }}
      {...props}
    />
  )
}