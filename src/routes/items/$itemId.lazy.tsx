import { createLazyFileRoute } from '@tanstack/react-router'
import ItemDetails from '../../components/item-details'

export const Route = createLazyFileRoute('/items/$itemId')({
  component: Details,
})

function Details() {
  const { itemId } = Route.useParams()
  return (
    <>
      <ItemDetails itemId={itemId} />
    </>
  )
}
