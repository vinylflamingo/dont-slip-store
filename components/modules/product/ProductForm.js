import { useState, useContext, useEffect } from 'react'
import { formatter } from '../../../utils/helpers'
import ProductOptions from './ProductOptions'
import { CartContext } from '../../../context/shopContext'

export default function ProductForm({ product }) {
  const { addToCart, cartOpen, setCartOpen, cart } = useContext(CartContext);

  const [allVariantOptions, setAllVariantOptions] = useState(product.variants.edges
    ?.map(variant => {
        const allOptions = {};
        if (variant.node.quantityAvailable > 0) {
            variant.node.selectedOptions.map(item => {
                allOptions[item.name] = item.value
            });
            return {
                id: variant.node.id,
                title: product.title,
                handle: product.handle,
                image: variant.node.image?.url,
                options: allOptions,
                variantTitle: variant.node.title,
                variantPrice: variant.node.priceV2.amount,
                variantQuantity: variant.node.quantityAvailable,
            };
        }
        return null;
    })
    .filter(variant => variant != null));

  const defaultValues = {};
  product.options.forEach(option => {
    const validValues = option.values.filter(value =>
      allVariantOptions.some(variant => variant.options[option.name] === value)
    );
    defaultValues[option.name] = validValues[0];
  });

  const [selectedVariant, setSelectedVariant] = useState(allVariantOptions[0]);
  const [selectedOptions, setSelectedOptions] = useState(defaultValues);

  function setOptions(name, value) {
    setSelectedOptions(prevState => {
      return { ...prevState, [name]: value };
    });

    const selection = {
      ...selectedOptions,
      [name]: value,
    };

    const matchingVariant = allVariantOptions.find(item => 
      JSON.stringify(item.options) === JSON.stringify(selection)
    );
    setSelectedVariant(matchingVariant);
  }

  function updateVariants() {
    const updatedVariants = product.variants.edges
      .filter(variant => {
        const cartItem = cart.find(item => item.id === variant.node.id);
        return !cartItem || cartItem.variantQuantity < variant.node.quantityAvailable;
      })
      .map(variant => {
        const allOptions = {};
        if (variant.node.quantityAvailable > 0) {
          variant.node.selectedOptions.map(item => {
            allOptions[item.name] = item.value;
          });
          return {
            id: variant.node.id,
            title: product.title,
            handle: product.handle,
            image: variant.node.image?.url,
            options: allOptions,
            variantTitle: variant.node.title,
            variantPrice: variant.node.priceV2.amount,
            variantQuantity: variant.node.quantityAvailable,
          };
        }
        return null;
      })
      .filter(variant => variant != null);

    setAllVariantOptions(updatedVariants);
    setSelectedVariant(updatedVariants[0] || null); // Update selected variant to the first one in the list
  }

  useEffect(() => {
    updateVariants();
  }, [cart]);

  return (
    <div className="p-4 flex flex-col w-full md:w-1/3">
      <h2 className='text-4xl font-bold'>{product.title}</h2>
      <span className='pb-6'>{formatter.format(product.variants.edges[0].node.priceV2.amount)}</span>
      {product.options.map(({ name, values }) => (
        <ProductOptions
          key={`key-${name}`}
          name={name}
          values={values.filter(value => 
            allVariantOptions.some(variant => variant.options[name] === value)
          )}
          selectedOptions={selectedOptions}
          setOptions={setOptions}
        />
      ))}
      <button
        onClick={() => {
          addToCart(selectedVariant, 1, product);
          setCartOpen(!cartOpen);
        }}
        className='bg-black rounded-lg text-white px-2 py-3 hover:bg-gray-800'>
        Add to Cart
      </button>
    </div>
  );
}