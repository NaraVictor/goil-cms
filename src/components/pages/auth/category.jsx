import { useAtom } from "jotai";
import { businessTypes } from "../../../helpers/config";
import { shopCategoryAtom } from "../../../helpers/state/signup";

const CategoryStep = () => {
    const [ category, setCategory ] = useAtom( shopCategoryAtom )

    return (
        <div className="text-center mx-md-5" >
            <div className="row">
                { businessTypes.map( bt =>
                    <div
                        key={ bt.id }
                        onClick={ () => setCategory( bt.id ) }
                        className={ `${ category.title === bt.id && ' text-white bokx-bg' }  py-3  
                         col-md-3 col d-flex justify-content-center align-items-center hover-hand bokx-card
                        bokx-border ` }
                    >
                        { bt.name }
                    </div>
                ) }
            </div>
        </div>
    );
}

export default CategoryStep;