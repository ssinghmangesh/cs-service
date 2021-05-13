const axios = require("axios");

const customerWebhook = async () => {
    await axios({
        url: "http://localhost:3000/data-manager/product/add",
        method: "POST",
        data:{product:{
            "id": 788032119674292922,
            "title": "Example T-Shirt",
            "body_html": null,
            "vendor": "Acme",
            "product_type": "Shirts",
            "created_at": null,
            "handle": "example-t-shirt",
            "updated_at": "2021-04-01T14:58:34-04:00",
            "published_at": "2021-04-01T14:58:34-04:00",
            "template_suffix": null,
            "status": "active",
            "published_scope": "web",
            "tags": "example, mens, t-shirt",
            "admin_graphql_api_id": "gid:\/\/shopify\/Product\/788032119674292922",
            "variants": [
              {
                "id": 642667041472713922,
                "product_id": 788032119674292922,
                "title": "",
                "price": "19.99",
                "sku": "example-shirt-s",
                "position": 0,
                "inventory_policy": "deny",
                "compare_at_price": "24.99",
                "fulfillment_service": "manual",
                "inventory_management": "shopify",
                "option1": "Small",
                "option2": null,
                "option3": null,
                "created_at": null,
                "updated_at": null,
                "taxable": true,
                "barcode": null,
                "grams": 200,
                "image_id": null,
                "weight": 200.0,
                "weight_unit": "g",
                "inventory_item_id": null,
                "inventory_quantity": 75,
                "old_inventory_quantity": 75,
                "requires_shipping": true,
                "admin_graphql_api_id": "gid:\/\/shopify\/ProductVariant\/642667041472713922"
              },
              {
                "id": 757650484644203962,
                "product_id": 788032119674292922,
                "title": "",
                "price": "19.99",
                "sku": "example-shirt-m",
                "position": 0,
                "inventory_policy": "deny",
                "compare_at_price": "24.99",
                "fulfillment_service": "manual",
                "inventory_management": "shopify",
                "option1": "Medium",
                "option2": null,
                "option3": null,
                "created_at": null,
                "updated_at": null,
                "taxable": true,
                "barcode": null,
                "grams": 200,
                "image_id": null,
                "weight": 200.0,
                "weight_unit": "g",
                "inventory_item_id": null,
                "inventory_quantity": 50,
                "old_inventory_quantity": 50,
                "requires_shipping": true,
                "admin_graphql_api_id": "gid:\/\/shopify\/ProductVariant\/757650484644203962"
              }
            ],
            "options": [
              {
                "id": 527050010214937811,
                "product_id": 788032119674292922,
                "name": "Title",
                "position": 1,
                "values": [
                  "Small",
                  "Medium"
                ]
              }
            ],
            "images": [
              {
                "id": 539438707724640965,
                "product_id": 788032119674292922,
                "position": 0,
                "created_at": null,
                "updated_at": null,
                "alt": null,
                "width": 323,
                "height": 434,
                "src": "\/\/cdn.shopify.com\/shopifycloud\/shopify\/assets\/shopify_shirt-39bb555874ecaeed0a1170417d58bbcf792f7ceb56acfe758384f788710ba635.png",
                "variant_ids": [
                ],
                "admin_graphql_api_id": "gid:\/\/shopify\/ProductImage\/539438707724640965"
              }
            ],
            "image": null
          }
          }})
    
}

customerWebhook()
    .then(console.log)
    .catch(console.log);