import {MouseEventHandler} from 'react';

interface IButtonParams {
    caption: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    width?: string;
    disabled?: boolean;
}
/**
 * Button
 * @constructor
 * @param params
 */
export default function Button(params: IButtonParams) {
    return (
        <button
            className={'button' + (params.disabled ? ' disabled' : '')}
            disabled={params.disabled ?? false}
            onClick={params.onClick}>
            {params.caption}
            <style jsx>{`
                .button {
                  background: #7075E9;
                  border-radius: 12px;
                  color: #fff;
                  border: none;
                  cursor: pointer;
                  display: block;
                  padding: 16px 30px;
                  font-size: 16px;
                  align-items: flex-end;
                  font-weight: 500;
                  margin-right: 20px;
                  white-space: nowrap;
                  width: ${params.width || 'auto'};
                  font-family: 'Roboto', sans-serif;
                }
                .disabled {
                  background: #C6C9F4;
                  cursor: not-allowed;
                }
          `}</style>
        </button>
    );
};