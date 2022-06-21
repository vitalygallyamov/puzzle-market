/**
 * Page title
 * @param title
 * @constructor
 */
export default function Title({title}: {title: string}) {
    return (
        <h1 className="title">
            {title}
            <style jsx>{`
            .title {
              font-size: 32px;
              font-weight: 500;
              color: #363870;
              margin-bottom: 24px;
            }
          `}</style>
        </h1>
    );
};