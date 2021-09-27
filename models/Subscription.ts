import { IStripeSubscription } from "@recoil/selectors/subscription";
import { Product } from "./Product";

export class Subscription {
  public id: string;
  public status: "active" | "past_due" | "unpaid" | "canceled" | "incomplete" | "incomplete_expired" | "trialing" | string;
  public clientSecret: string;
  public amount: number;
  public productId : string;
  public product: Product;

  public static fromStripeData = (stripeData: IStripeSubscription): Subscription => {
    const subscription = new Subscription();

    subscription.id = stripeData.id;
    subscription.status = stripeData.status;
    subscription.amount = stripeData.latest_invoice.amount_paid + stripeData.latest_invoice.amount_remaining;
    subscription.clientSecret = stripeData.latest_invoice.payment_intent.client_secret;
    subscription.productId = stripeData.items.data[0].price.product;

    return subscription;
  }
}