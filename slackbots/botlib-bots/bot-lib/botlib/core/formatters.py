import cStringIO as StringIO
import traceback

import sys

import io
from xhtml2pdf import pisa
import pytablewriter


class Formatters:
    def __init__(self):
        pass

    @staticmethod
    def vertical_str(df):
        columns = []
        max_length = 0
        for col in df.columns:
            if len(col) > max_length:
                max_length = len(col)
            columns.append(col)

        ret_string = ''
        for index, row in df.iterrows():
            for col in columns:
                ret_string += col.ljust(max_length) + ' : ' + str(row[col]) + '\n'
        ret_string += '\n\n'

        return ret_string

    @staticmethod
    def to_pdf(df, caption=''):
        styles = [
            dict(selector="caption", props=[("caption-side", "bottom")])
        ]
        df.index.names = [None]
        if not df.index.is_unique or not df.columns.is_unique:
           html = df.to_html(index=False)
        else:
            html = (df.style.set_table_styles(styles)
                    .set_caption(caption)).render()

        result = StringIO.StringIO()
        pisa.CreatePDF(
            StringIO.StringIO(html),
            result
        )
        return result.getvalue()

    @staticmethod
    def to_csv(df, sep=','):
        result_str = df.to_csv(index=False, sep=sep)
        return result_str

    @staticmethod
    def to_md(df, caption=''):
        writer = pytablewriter.MarkdownTableWriter()
        writer.stream = io.StringIO()
        writer.table_name = caption
        writer.header_list = list(df.columns.values)
        writer.value_matrix = df.values.tolist()
        try:
            return writer.stream.getvalue()
        except Exception as ex:
            exc_type, exc_value, exc_traceback = sys.exc_info()
        print '*Failed executing command*' + ''.join(
            traceback.format_exception(exc_type, exc_value, exc_traceback))
