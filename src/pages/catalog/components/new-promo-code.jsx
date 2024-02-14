const NewPromoCodeForm = ( props ) =>
{
    return (
        <div>
            <form>
                <div className="row align-items-center">
                    <div className="col-6">
                        <label className="mb-0" htmlFor="promoCode">Promo Code</label>
                        <input className="input"
                            id="promoCode" placeholder="e.g. EF200-22" maxLength={ 50 } />
                        <small className="text-muted">custom promo code. Max characters: 50</small>
                    </div>
                    <div className="col-4">
                        <label className="mb-0" htmlFor="noUser">Number of Usage</label>
                        <input className="input"
                            id="noUser" min={ 1 } />
                        <small className="text-muted">leave blank for unlimited</small>
                    </div>

                    <div className="col-2">
                        <button className="button">
                            <span className="bi bi-trash text-danger"></span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default NewPromoCodeForm;